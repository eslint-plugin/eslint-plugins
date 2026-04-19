import { describe, it, expect } from "bun:test";

const isFirstLetterCapitalized = require("../../src/util/isFirstLetterCapitalized");

describe("isFirstLetterCapitalized", () => {
  it("should return false for invalid input", () => {
    expect(isFirstLetterCapitalized()).toBe(false);
    expect(isFirstLetterCapitalized(null)).toBe(false);
    expect(isFirstLetterCapitalized("")).toBe(false);
  });

  it("should return false for uncapitalized string", () => {
    expect(isFirstLetterCapitalized("isCapitalized")).toBe(false);
    expect(isFirstLetterCapitalized("lowercase")).toBe(false);
    expect(isFirstLetterCapitalized("_startsWithUnderscore")).toBe(false);
    expect(isFirstLetterCapitalized("__startsWithUnderscore")).toBe(false);
  });

  it("should return true for capitalized string, with or without leading underscores", () => {
    expect(isFirstLetterCapitalized("IsCapitalized")).toBe(true);
    expect(isFirstLetterCapitalized("_IsCapitalized")).toBe(true);
    expect(isFirstLetterCapitalized("__IsCapitalized")).toBe(true);
    expect(isFirstLetterCapitalized("UPPERCASE")).toBe(true);
    expect(isFirstLetterCapitalized("_UPPERCASE")).toBe(true);
    expect(isFirstLetterCapitalized("__UPPERCASE")).toBe(true);
  });
});
