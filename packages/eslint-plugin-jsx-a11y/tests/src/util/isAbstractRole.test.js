import { describe, expect, it } from "bun:test";

import { elementType } from "@eslintplugin/jsx-ast-utils";

import {
  genElementSymbol,
  genAbstractRoleElements,
  genNonAbstractRoleElements,
} from "../../../__mocks__/genInteractives";
import isAbstractRole from "../../../src/util/isAbstractRole";

describe("isAbstractRole", () => {
  it("does NOT identify JSX Components (no tagName) as abstract role elements", () => {
    expect(isAbstractRole(undefined, [])).toBe(false);
  });

  describe("elements with an abstract role", () => {
    genAbstractRoleElements().forEach(({ openingElement }) => {
      const { attributes } = openingElement;
      const tagName = elementType(openingElement);
      const symbol = genElementSymbol(openingElement);

      it(`identifies \`${symbol}\` as an abstract role element`, () => {
        expect(isAbstractRole(tagName, attributes)).toBe(true);
      });
    });
  });

  describe("elements with a non-abstract role", () => {
    genNonAbstractRoleElements().forEach(({ openingElement }) => {
      const { attributes } = openingElement;
      const tagName = elementType(openingElement);
      const symbol = genElementSymbol(openingElement);

      it(`does NOT identify \`${symbol}\` as an abstract role element`, () => {
        expect(isAbstractRole(tagName, attributes)).toBe(false);
      });
    });
  });
});
