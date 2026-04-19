import { describe, expect, it } from "bun:test";

import { elementType } from "@eslintplugin/jsx-ast-utils";

import {
  genElementSymbol,
  genIndeterminantInteractiveElements,
  genInteractiveElements,
  genInteractiveRoleElements,
  genNonInteractiveElements,
  genNonInteractiveRoleElements,
} from "../../../__mocks__/genInteractives";
import JSXElementMock from "../../../__mocks__/JSXElementMock";
import isInteractiveElement from "../../../src/util/isInteractiveElement";

describe("isInteractiveElement", () => {
  it("returns false for undefined tag name", () => {
    expect(isInteractiveElement(undefined, [])).toBe(false);
  });

  describe("interactive elements", () => {
    genInteractiveElements().forEach(({ openingElement }) => {
      const tag = elementType(openingElement);
      const symbol = genElementSymbol(openingElement);
      const { attributes } = openingElement;

      it(`identifies \`${symbol}\` as an interactive element`, () => {
        expect(isInteractiveElement(tag, attributes)).toBe(true);
      });
    });
  });

  describe("interactive role elements", () => {
    genInteractiveRoleElements().forEach(({ openingElement }) => {
      const tag = elementType(openingElement);
      const symbol = genElementSymbol(openingElement);
      const { attributes } = openingElement;

      it(`does NOT identify \`${symbol}\` as an interactive element`, () => {
        expect(isInteractiveElement(tag, attributes)).toBe(false);
      });
    });
  });

  describe("non-interactive elements", () => {
    genNonInteractiveElements().forEach(({ openingElement }) => {
      const tag = elementType(openingElement);
      const symbol = genElementSymbol(openingElement);
      const { attributes } = openingElement;

      it(`does NOT identify \`${symbol}\` as an interactive element`, () => {
        expect(isInteractiveElement(tag, attributes)).toBe(false);
      });
    });
  });

  describe("non-interactive role elements", () => {
    genNonInteractiveRoleElements().forEach(({ openingElement }) => {
      const tag = elementType(openingElement);
      const symbol = genElementSymbol(openingElement);
      const { attributes } = openingElement;

      it(`does NOT identify \`${symbol}\` as an interactive element`, () => {
        expect(isInteractiveElement(tag, attributes)).toBe(false);
      });
    });
  });

  describe("indeterminate elements", () => {
    genIndeterminantInteractiveElements().forEach(({ openingElement }) => {
      const tag = elementType(openingElement);
      const symbol = genElementSymbol(openingElement);
      const { attributes } = openingElement;

      it(`does NOT identify \`${symbol}\` as an interactive element`, () => {
        expect(isInteractiveElement(tag, attributes)).toBe(false);
      });
    });
  });

  it("identifies JSX elements as not interactive", () => {
    expect(isInteractiveElement("CustomComponent", JSXElementMock())).toBe(
      false,
    );
  });
});
