import { expect, describe, it, beforeEach } from "bun:test";

import propName from "../src/propName";
import { extractProp, setParserName } from "./helper";

describe("propName", () => {
  beforeEach(() => {
    setParserName("babel");
  });
  it("should export a function", () => {
    const expected = "function";
    const actual = typeof propName;

    expect(actual).toEqual(expected);
  });

  it("should throw an error if the argument is missing", () => {
    expect(() => {
      propName();
    }).toThrow(Error);
  });

  it("should throw an error if the argument not a JSX node", () => {
    expect(() => {
      // @ts-expect-error
      propName({ a: "foo" });
    }).toThrow(Error);
  });

  it("should return correct name for normal prop", () => {
    const prop = extractProp('<div foo="bar" />');

    const expected = "foo";
    const actual = propName(prop);

    expect(actual).toEqual(expected);
  });

  it("should return correct name for namespaced prop", () => {
    const prop = extractProp('<div foo:bar="baz" />', "foo:bar");

    const expected = "foo:bar";
    const actual = propName(prop);

    expect(actual).toEqual(expected);
  });
});
