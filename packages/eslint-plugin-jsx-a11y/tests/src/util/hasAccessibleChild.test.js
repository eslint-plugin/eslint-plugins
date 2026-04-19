import { describe, expect, it } from "bun:test";

import { elementType } from "@eslintplugin/jsx-ast-utils";

import JSXAttributeMock from "../../../__mocks__/JSXAttributeMock";
import JSXElementMock from "../../../__mocks__/JSXElementMock";
import JSXExpressionContainerMock from "../../../__mocks__/JSXExpressionContainerMock";
import hasAccessibleChild from "../../../src/util/hasAccessibleChild";

describe("hasAccessibleChild", () => {
  it("returns false when there are no children and no dangerouslySetInnerHTML", () => {
    expect(hasAccessibleChild(JSXElementMock("div", []), elementType)).toBe(
      false,
    );
  });

  it("returns true when there are no children but dangerouslySetInnerHTML is set", () => {
    const element = JSXElementMock(
      "div",
      [JSXAttributeMock("dangerouslySetInnerHTML", true)],
      [],
    );
    expect(hasAccessibleChild(element, elementType)).toBe(true);
  });

  it("returns true when there is a Literal child", () => {
    const element = JSXElementMock(
      "div",
      [],
      [{ type: "Literal", value: "foo" }],
    );
    expect(hasAccessibleChild(element, elementType)).toBe(true);
  });

  it("returns true when there is a visible JSXElement child", () => {
    const element = JSXElementMock("div", [], [JSXElementMock("div", [])]);
    expect(hasAccessibleChild(element, elementType)).toBe(true);
  });

  it("returns true when there is a JSXText element", () => {
    const element = JSXElementMock(
      "div",
      [],
      [{ type: "JSXText", value: "foo" }],
    );
    expect(hasAccessibleChild(element, elementType)).toBe(true);
  });

  it("returns false when the child JSXElement is hidden via aria-hidden", () => {
    const element = JSXElementMock(
      "div",
      [],
      [JSXElementMock("div", [JSXAttributeMock("aria-hidden", true)])],
    );
    expect(hasAccessibleChild(element, elementType)).toBe(false);
  });

  it("returns true for a defined JSXExpressionContainer", () => {
    const element = JSXElementMock(
      "div",
      [],
      [JSXExpressionContainerMock({ type: "Identifier", name: "foo" })],
    );
    expect(hasAccessibleChild(element, elementType)).toBe(true);
  });

  it("returns false for an undefined JSXExpressionContainer", () => {
    const element = JSXElementMock(
      "div",
      [],
      [JSXExpressionContainerMock({ type: "Identifier", name: "undefined" })],
    );
    expect(hasAccessibleChild(element, elementType)).toBe(false);
  });

  it("returns false for an unknown child type", () => {
    const element = JSXElementMock("div", [], [{ type: "Unknown" }]);
    expect(hasAccessibleChild(element, elementType)).toBe(false);
  });

  it("returns true when children are passed as a prop", () => {
    const element = JSXElementMock(
      "div",
      [JSXAttributeMock("children", true)],
      [],
    );
    expect(hasAccessibleChild(element, elementType)).toBe(true);
  });

  it("returns false when the child is a hidden input", () => {
    const element = JSXElementMock(
      "div",
      [],
      [JSXElementMock("input", [JSXAttributeMock("type", "hidden")])],
    );
    expect(hasAccessibleChild(element, elementType)).toBe(false);
  });

  it("returns true for a custom JSXElement even if type is hidden", () => {
    const element = JSXElementMock(
      "div",
      [],
      [JSXElementMock("CustomInput", [JSXAttributeMock("type", "hidden")])],
    );
    expect(hasAccessibleChild(element, elementType)).toBe(true);
  });

  it("returns false when a custom JSXElement is mapped to an input and type is hidden", () => {
    const element = JSXElementMock(
      "div",
      [],
      [JSXElementMock("CustomInput", [JSXAttributeMock("type", "hidden")])],
    );
    expect(hasAccessibleChild(element, () => "input")).toBe(false);
  });
});
