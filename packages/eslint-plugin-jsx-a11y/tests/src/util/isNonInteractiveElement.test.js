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
import isNonInteractiveElement from "../../../src/util/isNonInteractiveElement";

describe("isNonInteractiveElement", () => {
  it("identifies JSX Components (no tagName) as non-interactive elements", () => {
    expect(isNonInteractiveElement(undefined, [])).toBe(false);
  });

  describe("non-interactive elements", () => {
    genNonInteractiveElements().forEach(({ openingElement }) => {
      const tag = elementType(openingElement);
      const symbol = genElementSymbol(openingElement);
      const { attributes } = openingElement;

      it(`identifies \`${symbol}\` as a non-interactive element`, () => {
        expect(isNonInteractiveElement(tag, attributes)).toBe(true);
      });
    });
  });

  describe("non-interactive role elements", () => {
    genNonInteractiveRoleElements().forEach(({ openingElement }) => {
      const tag = elementType(openingElement);
      const symbol = genElementSymbol(openingElement);
      const { attributes } = openingElement;

      it(`does NOT identify \`${symbol}\` as a non-interactive element`, () => {
        expect(isNonInteractiveElement(tag, attributes)).toBe(false);
      });
    });
  });

  describe("interactive elements", () => {
    genInteractiveElements().forEach(({ openingElement }) => {
      const tag = elementType(openingElement);
      const symbol = genElementSymbol(openingElement);
      const { attributes } = openingElement;

      it(`does NOT identify \`${symbol}\` as a non-interactive element`, () => {
        expect(isNonInteractiveElement(tag, attributes)).toBe(false);
      });
    });
  });

  describe("interactive role elements", () => {
    genInteractiveRoleElements().forEach(({ openingElement }) => {
      const tag = elementType(openingElement);
      const symbol = genElementSymbol(openingElement);
      const { attributes } = openingElement;

      it(`does NOT identify \`${symbol}\` as a non-interactive element`, () => {
        expect(isNonInteractiveElement(tag, attributes)).toBe(false);
      });
    });
  });

  describe("indeterminate elements", () => {
    genIndeterminantInteractiveElements().forEach(({ openingElement }) => {
      const tag = elementType(openingElement);
      const symbol = genElementSymbol(openingElement);
      const { attributes } = openingElement;

      it(`does NOT identify \`${symbol}\` as a non-interactive element`, () => {
        expect(isNonInteractiveElement(tag, attributes)).toBe(false);
      });
    });
  });
});
