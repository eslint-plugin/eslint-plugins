import { describe, expect, it } from "bun:test";

import JSXAttributeMock from "../../../__mocks__/JSXAttributeMock";
import isContentEditable from "../../../src/util/isContentEditable";

describe("isContentEditable - HTML5", () => {
  it("identifies HTML5 contentEditable elements", () => {
    expect(
      isContentEditable("some tag", [
        JSXAttributeMock("contentEditable", "true"),
      ]),
    ).toBe(true);
  });

  describe("not content editable", () => {
    it("does not identify elements with null as the value", () => {
      expect(
        isContentEditable("some tag", [
          JSXAttributeMock("contentEditable", null),
        ]),
      ).toBe(false);
    });

    it("does not identify elements with undefined as the value", () => {
      expect(
        isContentEditable("some tag", [
          JSXAttributeMock("contentEditable", undefined),
        ]),
      ).toBe(false);
    });

    it("does not identify elements with boolean true as the value", () => {
      expect(
        isContentEditable("some tag", [
          JSXAttributeMock("contentEditable", true),
        ]),
      ).toBe(false);
    });

    it('does not identify elements with "false" string as the value', () => {
      expect(
        isContentEditable("some tag", [
          JSXAttributeMock("contentEditable", "false"),
        ]),
      ).toBe(false);
    });
  });
});
