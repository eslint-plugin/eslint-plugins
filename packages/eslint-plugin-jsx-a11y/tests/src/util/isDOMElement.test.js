import { describe, expect, it } from "bun:test";
import { elementType } from "@eslintplugin/jsx-ast-utils";
import { dom } from "aria-query";

import JSXElementMock from "../../../__mocks__/JSXElementMock";
import isDOMElement from "../../../src/util/isDOMElement";

describe("isDOMElement", () => {
  describe("DOM elements", () => {
    dom.forEach((_, el) => {
      it(`identifies ${el} as a DOM element`, () => {
        const element = JSXElementMock(el);
        expect(isDOMElement(elementType(element.openingElement))).toBe(true);
      });
    });
  });

  it("does not identify a custom element", () => {
    expect(isDOMElement(JSXElementMock("CustomElement"))).toBe(false);
  });
});
