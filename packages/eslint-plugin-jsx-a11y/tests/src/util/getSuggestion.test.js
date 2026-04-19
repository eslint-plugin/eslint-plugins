import { describe, expect, it } from "bun:test";

import getSuggestion from "../../../src/util/getSuggestion";

describe("spell check suggestion API", () => {
  it("returns no suggestions given empty word and no dictionary", () => {
    expect(getSuggestion("foo")).toEqual([]);
  });

  it("returns no suggestions given real word and no dictionary", () => {
    expect(getSuggestion("foo")).toEqual([]);
  });

  it("returns correct suggestion given real word and a dictionary", () => {
    expect(getSuggestion("fo", ["foo", "bar", "baz"])).toEqual(["foo"]);
  });

  it("returns multiple correct suggestions given real word and a dictionary", () => {
    expect(getSuggestion("theer", ["there", "their", "foo", "bar"])).toEqual([
      "there",
      "their",
    ]);
  });

  it("returns correct # of suggestions given the limit argument", () => {
    expect(getSuggestion("theer", ["there", "their", "foo", "bar"], 1)).toEqual(
      ["there"],
    );
  });
});
