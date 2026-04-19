import { describe, expect, it } from "bun:test";

import JSXAttributeMock from "../../../__mocks__/JSXAttributeMock";
import isDisabledElement from "../../../src/util/isDisabledElement";

describe("isDisabledElement", () => {
  describe("HTML5", () => {
    it("identifies HTML5 disabled elements", () => {
      expect(
        isDisabledElement([JSXAttributeMock("disabled", "disabled")]),
      ).toBe(true);
    });

    it("identifies HTML5 disabled elements with null as the value", () => {
      expect(isDisabledElement([JSXAttributeMock("disabled", null)])).toBe(
        true,
      );
    });

    it("does not identify HTML5 disabled elements with undefined as the value", () => {
      expect(isDisabledElement([JSXAttributeMock("disabled", undefined)])).toBe(
        false,
      );
    });
  });

  describe("ARIA", () => {
    it("identifies ARIA disabled elements with string 'true'", () => {
      expect(
        isDisabledElement([JSXAttributeMock("aria-disabled", "true")]),
      ).toBe(true);
    });

    it("identifies ARIA disabled elements with boolean true", () => {
      expect(isDisabledElement([JSXAttributeMock("aria-disabled", true)])).toBe(
        true,
      );
    });

    it("does not identify ARIA disabled elements with string 'false'", () => {
      expect(
        isDisabledElement([JSXAttributeMock("aria-disabled", "false")]),
      ).toBe(false);
    });

    it("does not identify ARIA disabled elements with boolean false", () => {
      expect(
        isDisabledElement([JSXAttributeMock("aria-disabled", false)]),
      ).toBe(false);
    });

    it("does not identify ARIA disabled elements with null as the value", () => {
      expect(isDisabledElement([JSXAttributeMock("aria-disabled", null)])).toBe(
        false,
      );
    });

    it("does not identify ARIA disabled elements with undefined as the value", () => {
      expect(
        isDisabledElement([JSXAttributeMock("aria-disabled", undefined)]),
      ).toBe(false);
    });
  });
});
