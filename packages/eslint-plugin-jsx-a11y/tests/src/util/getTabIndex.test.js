import { describe, expect, it } from "bun:test";

import IdentifierMock from "../../../__mocks__/IdentifierMock";
import JSXAttributeMock from "../../../__mocks__/JSXAttributeMock";
import getTabIndex from "../../../src/util/getTabIndex";

describe("getTabIndex", () => {
  it("returns zero when tabIndex is defined as zero", () => {
    expect(getTabIndex(JSXAttributeMock("tabIndex", 0))).toBe(0);
  });

  it("returns a positive integer when tabIndex is defined as such", () => {
    expect(getTabIndex(JSXAttributeMock("tabIndex", 1))).toBe(1);
  });

  it("returns a negative integer when tabIndex is defined as such", () => {
    expect(getTabIndex(JSXAttributeMock("tabIndex", -1))).toBe(-1);
  });

  it("returns undefined when tabIndex is an empty string", () => {
    expect(getTabIndex(JSXAttributeMock("tabIndex", ""))).toBe(undefined);
  });

  it("returns undefined when tabIndex is a float", () => {
    expect(getTabIndex(JSXAttributeMock("tabIndex", 9.1))).toBe(undefined);
  });

  it("returns the integer when tabIndex is a string that converts to a number", () => {
    expect(getTabIndex(JSXAttributeMock("tabIndex", "0"))).toBe(0);
  });

  it("returns undefined when tabIndex is a string that is NaN", () => {
    expect(getTabIndex(JSXAttributeMock("tabIndex", "0a"))).toBe(undefined);
  });

  it("returns undefined when tabIndex is a boolean", () => {
    expect(getTabIndex(JSXAttributeMock("tabIndex", true))).toBe(undefined);
    expect(getTabIndex(JSXAttributeMock("tabIndex", false))).toBe(undefined);
  });

  it("returns the function type when tabIndex is a function expression", () => {
    expect(typeof getTabIndex(JSXAttributeMock("tabIndex", () => 0))).toBe(
      "function",
    );
  });

  it("returns the Identifier name when tabIndex is a variable expression", () => {
    const name = "identName";
    expect(
      getTabIndex(JSXAttributeMock("tabIndex", IdentifierMock(name), true)),
    ).toBe(name);
  });

  it("returns undefined when tabIndex is not defined", () => {
    expect(getTabIndex(JSXAttributeMock("tabIndex", undefined))).toBe(
      undefined,
    );
  });
});
