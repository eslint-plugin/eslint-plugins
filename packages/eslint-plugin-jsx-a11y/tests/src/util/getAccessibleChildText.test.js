import { describe, expect, it } from "bun:test";

import { elementType } from "@eslintplugin/jsx-ast-utils";

import JSXAttributeMock from "../../../__mocks__/JSXAttributeMock";
import JSXElementMock from "../../../__mocks__/JSXElementMock";
import getAccessibleChildText from "../../../src/util/getAccessibleChildText";

describe("getAccessibleChildText", () => {
  it("returns the aria-label when present", () => {
    const element = JSXElementMock("a", [
      JSXAttributeMock("aria-label", "foo"),
    ]);
    expect(getAccessibleChildText(element, elementType)).toBe("foo");
  });

  it("returns the aria-label instead of children", () => {
    const element = JSXElementMock(
      "a",
      [JSXAttributeMock("aria-label", "foo")],
      [{ type: "JSXText", value: "bar" }],
    );
    expect(getAccessibleChildText(element, elementType)).toBe("foo");
  });

  it("skips elements with aria-hidden=true", () => {
    const element = JSXElementMock("a", [
      JSXAttributeMock("aria-hidden", "true"),
    ]);
    expect(getAccessibleChildText(element, elementType)).toBe("");
  });

  it("returns literal value for JSXText child", () => {
    const element = JSXElementMock(
      "a",
      [],
      [{ type: "JSXText", value: "bar" }],
    );
    expect(getAccessibleChildText(element, elementType)).toBe("bar");
  });

  it("returns alt text for img child", () => {
    const element = JSXElementMock(
      "a",
      [],
      [
        JSXElementMock("img", [
          JSXAttributeMock("src", "some/path"),
          JSXAttributeMock("alt", "a sensible label"),
        ]),
      ],
    );
    expect(getAccessibleChildText(element, elementType)).toBe(
      "a sensible label",
    );
  });

  it("returns blank when alt tag is used on arbitrary element", () => {
    const element = JSXElementMock(
      "a",
      [],
      [JSXElementMock("span", [JSXAttributeMock("alt", "a sensible label")])],
    );
    expect(getAccessibleChildText(element, elementType)).toBe("");
  });

  it("returns literal value for Literal type child", () => {
    const element = JSXElementMock(
      "a",
      [],
      [{ type: "Literal", value: "bar" }],
    );
    expect(getAccessibleChildText(element, elementType)).toBe("bar");
  });

  it("returns trimmed literal value for JSXText child", () => {
    const element = JSXElementMock(
      "a",
      [],
      [{ type: "Literal", value: " bar   " }],
    );
    expect(getAccessibleChildText(element, elementType)).toBe("bar");
  });

  it("returns space-collapsed literal value for JSXText child", () => {
    const element = JSXElementMock(
      "a",
      [],
      [{ type: "Literal", value: "foo          bar" }],
    );
    expect(getAccessibleChildText(element, elementType)).toBe("foo bar");
  });

  it("returns punctuation-stripped literal value for JSXText child", () => {
    const element = JSXElementMock(
      "a",
      [],
      [{ type: "Literal", value: "foo, bar. baz? foo; bar:" }],
    );
    expect(getAccessibleChildText(element, elementType)).toBe(
      "foo bar baz foo bar",
    );
  });

  it("returns recursive value for JSXElement child", () => {
    const element = JSXElementMock(
      "a",
      [],
      [JSXElementMock("span", [], [{ type: "Literal", value: "bar" }])],
    );
    expect(getAccessibleChildText(element, elementType)).toBe("bar");
  });

  it("skips children with aria-hidden=true recursively", () => {
    const element = JSXElementMock(
      "a",
      [],
      [
        JSXElementMock(
          "span",
          [],
          [JSXElementMock("span", [JSXAttributeMock("aria-hidden", "true")])],
        ),
      ],
    );
    expect(getAccessibleChildText(element, elementType)).toBe("");
  });

  it("joins multiple children properly - no spacing", () => {
    const element = JSXElementMock(
      "a",
      [],
      [
        { type: "Literal", value: "foo" },
        { type: "Literal", value: "bar" },
      ],
    );
    expect(getAccessibleChildText(element, elementType)).toBe("foo bar");
  });

  it("joins multiple children properly - with spacing", () => {
    const element = JSXElementMock(
      "a",
      [],
      [
        { type: "Literal", value: " foo " },
        { type: "Literal", value: " bar " },
      ],
    );
    expect(getAccessibleChildText(element, elementType)).toBe("foo bar");
  });

  it("skips unknown elements", () => {
    const element = JSXElementMock(
      "a",
      [],
      [
        { type: "Literal", value: "foo" },
        { type: "Unknown" },
        { type: "Literal", value: "bar" },
      ],
    );
    expect(getAccessibleChildText(element, elementType)).toBe("foo bar");
  });
});
