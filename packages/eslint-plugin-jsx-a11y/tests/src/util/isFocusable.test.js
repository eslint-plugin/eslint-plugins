import { describe, expect, it } from "bun:test";

import { elementType } from "@eslintplugin/jsx-ast-utils";

import {
  genElementSymbol,
  genInteractiveElements,
  genNonInteractiveElements,
} from "../../../__mocks__/genInteractives";
import JSXAttributeMock from "../../../__mocks__/JSXAttributeMock";
import isFocusable from "../../../src/util/isFocusable";

function mergeTabIndex(index, attributes) {
  return [].concat(attributes, JSXAttributeMock("tabIndex", index));
}

describe("isFocusable", () => {
  describe("interactive elements", () => {
    genInteractiveElements().forEach(({ openingElement }) => {
      const tag = elementType(openingElement);
      const symbol = genElementSymbol(openingElement);
      const { attributes } = openingElement;

      it(`identifies \`${symbol}\` as a focusable element`, () => {
        expect(isFocusable(tag, attributes)).toBe(true);
      });

      it(`does NOT identify \`${symbol}\` with tabIndex of -1 as a focusable element`, () => {
        expect(isFocusable(tag, mergeTabIndex(-1, attributes))).toBe(false);
      });

      it(`identifies \`${symbol}\` with tabIndex of 0 as a focusable element`, () => {
        expect(isFocusable(tag, mergeTabIndex(0, attributes))).toBe(true);
      });

      it(`identifies \`${symbol}\` with tabIndex of 1 as a focusable element`, () => {
        expect(isFocusable(tag, mergeTabIndex(1, attributes))).toBe(true);
      });
    });
  });

  describe("non-interactive elements", () => {
    genNonInteractiveElements().forEach(({ openingElement }) => {
      const tag = elementType(openingElement);
      const symbol = genElementSymbol(openingElement);
      const { attributes } = openingElement;

      it(`does NOT identify \`${symbol}\` as a focusable element`, () => {
        expect(isFocusable(tag, attributes)).toBe(false);
      });

      it(`does NOT identify \`${symbol}\` with tabIndex of -1 as a focusable element`, () => {
        expect(isFocusable(tag, mergeTabIndex(-1, attributes))).toBe(false);
      });

      it(`identifies \`${symbol}\` with tabIndex of 0 as a focusable element`, () => {
        expect(isFocusable(tag, mergeTabIndex(0, attributes))).toBe(true);
      });

      it(`identifies \`${symbol}\` with tabIndex of 1 as a focusable element`, () => {
        expect(isFocusable(tag, mergeTabIndex(1, attributes))).toBe(true);
      });

      it(`does NOT identify \`${symbol}\` with tabIndex of 'bogus' as a focusable element`, () => {
        expect(isFocusable(tag, mergeTabIndex("bogus", attributes))).toBe(
          false,
        );
      });
    });
  });
});
