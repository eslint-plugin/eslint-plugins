import { describe, expect, it } from "bun:test";

import { elementType } from "@eslintplugin/jsx-ast-utils";

import {
  genElementSymbol,
  genInteractiveRoleElements,
  genNonInteractiveRoleElements,
} from "../../../__mocks__/genInteractives";
import isNonInteractiveRole from "../../../src/util/isNonInteractiveRole";

describe("isNonInteractiveRole", () => {
  it("identifies JSX Components (no tagName) as non-interactive elements", () => {
    expect(isNonInteractiveRole(undefined, [])).toBe(false);
  });

  describe("elements with a non-interactive role", () => {
    genNonInteractiveRoleElements().forEach(({ openingElement }) => {
      const { attributes } = openingElement;
      const tag = elementType(openingElement);
      const symbol = genElementSymbol(openingElement);

      it(`identifies \`${symbol}\` as a non-interactive role element`, () => {
        expect(isNonInteractiveRole(tag, attributes)).toBe(true);
      });
    });
  });

  it("does NOT identify elements without a role as non-interactive role elements", () => {
    expect(isNonInteractiveRole("div", [])).toBe(false);
  });

  describe("elements with an interactive role", () => {
    genInteractiveRoleElements().forEach(({ openingElement }) => {
      const { attributes } = openingElement;
      const tag = elementType(openingElement);
      const symbol = genElementSymbol(openingElement);

      it(`does NOT identify \`${symbol}\` as a non-interactive role element`, () => {
        expect(isNonInteractiveRole(tag, attributes)).toBe(false);
      });
    });
  });
});
