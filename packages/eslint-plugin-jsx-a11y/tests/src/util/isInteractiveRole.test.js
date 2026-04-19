import { describe, expect, it } from "bun:test";
import { elementType } from "@eslintplugin/jsx-ast-utils";

import {
  genElementSymbol,
  genInteractiveRoleElements,
  genNonInteractiveRoleElements,
} from "../../../__mocks__/genInteractives";
import isInteractiveRole from "../../../src/util/isInteractiveRole";

describe("isInteractiveRole", () => {
  it("identifies JSX Components (no tagName) as interactive role elements", () => {
    expect(isInteractiveRole(undefined, [])).toBe(false);
  });

  describe("elements with a non-interactive role", () => {
    genNonInteractiveRoleElements().forEach(({ openingElement }) => {
      const { attributes } = openingElement;
      const tag = elementType(openingElement);
      const symbol = genElementSymbol(openingElement);

      it(`does NOT identify \`${symbol}\` as an interactive role element`, () => {
        expect(isInteractiveRole(tag, attributes)).toBe(false);
      });
    });
  });

  it("does NOT identify elements without a role as interactive role elements", () => {
    expect(isInteractiveRole("div", [])).toBe(false);
  });

  describe("elements with an interactive role", () => {
    genInteractiveRoleElements().forEach(({ openingElement }) => {
      const { attributes } = openingElement;
      const tag = elementType(openingElement);
      const symbol = genElementSymbol(openingElement);

      it(`identifies \`${symbol}\` as an interactive role element`, () => {
        expect(isInteractiveRole(tag, attributes)).toBe(true);
      });
    });
  });
});
