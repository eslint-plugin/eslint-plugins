import { describe, expect, it } from "bun:test";

import JSXAttributeMock from "../../../__mocks__/JSXAttributeMock";
import JSXElementMock from "../../../__mocks__/JSXElementMock";
import attributesComparator from "../../../src/util/attributesComparator";

describe("attributesComparator", () => {
  it("returns true when baseAttributes and attributes are undefined", () => {
    expect(attributesComparator()).toBe(true);
  });

  it("returns true when baseAttributes and attributes are empty", () => {
    expect(attributesComparator([], [])).toBe(true);
  });

  it("returns true when baseAttributes are empty and attributes have values", () => {
    expect(
      attributesComparator(
        [],
        [JSXAttributeMock("foo", 0), JSXAttributeMock("bar", "baz")],
      ),
    ).toBe(true);
  });

  const baseAttributes = [
    { name: "biz", value: 1 },
    { name: "fizz", value: "pop" },
    { name: "fuzz", value: "lolz" },
  ];

  it("returns false when baseAttributes have values and attributes are empty", () => {
    expect(attributesComparator(baseAttributes, [])).toBe(false);
  });

  it("returns false when values are different", () => {
    expect(
      attributesComparator(baseAttributes, [
        JSXElementMock(),
        JSXAttributeMock("biz", 2),
        JSXAttributeMock("ziff", "opo"),
        JSXAttributeMock("far", "lolz"),
      ]),
    ).toBe(false);
  });

  it("returns false when attributes are only a subset of baseAttributes", () => {
    expect(
      attributesComparator(baseAttributes, [
        JSXAttributeMock("biz", 1),
        JSXAttributeMock("fizz", "pop"),
        JSXAttributeMock("goo", "gazz"),
      ]),
    ).toBe(false);
  });

  it("returns true when values match exactly", () => {
    expect(
      attributesComparator(baseAttributes, [
        JSXAttributeMock("biz", 1),
        JSXAttributeMock("fizz", "pop"),
        JSXAttributeMock("fuzz", "lolz"),
      ]),
    ).toBe(true);
  });

  it("returns true when attributes are a superset of baseAttributes", () => {
    expect(
      attributesComparator(baseAttributes, [
        JSXAttributeMock("biz", 1),
        JSXAttributeMock("fizz", "pop"),
        JSXAttributeMock("fuzz", "lolz"),
        JSXAttributeMock("dar", "tee"),
      ]),
    ).toBe(true);
  });
});
