import { expect, describe, it, beforeEach } from "bun:test";

import getProp from "../src/getProp";
import { getOpeningElement, setParserName } from "./helper";

describe("getProp", () => {
  beforeEach(() => {
    setParserName("babel");
  });
  it("should export a function", () => {
    const expected = "function";
    const actual = typeof getProp;

    expect(actual).toEqual(expected);
  });

  it("should return undefined if no arguments are provided", () => {
    const expected = undefined;
    const actual = getProp();

    expect(actual).toEqual(expected);
  });

  it("should return undefined if the attribute is absent", () => {
    const code = "<div />";
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = "id";

    const expected = undefined;
    const actual = getProp(props, prop);

    expect(actual).toEqual(expected);
  });

  it("should return the correct attribute if the attribute exists", () => {
    const code = '<div id="foo" />';
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = "id";

    const expected = "id";

    expect(getProp(props, prop)).toHaveProperty("name.name", expected);
  });

  it("should return the correct attribute if the attribute exists in spread", () => {
    const code = '<div {...{ id: "foo" }} />';
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = "ID";

    const expected = "id";

    expect(getProp(props, prop)).toHaveProperty("name.name", expected);
  });

  it("should return the correct attribute if the attribute exists in spread as an expression", () => {
    const code = "<div {...{ id }} />";
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = "id";

    const expected = "id";
    const actual = getProp(props, prop);

    expect(actual).toHaveProperty("name.name", expected);
    expect(actual).toHaveProperty("value.expression.name", expected);
  });

  it("should return the correct attribute if the attribute exists in spread (case sensitive)", () => {
    const code = '<div {...{ id: "foo" }} />';
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = "id";
    const options = { ignoreCase: false };

    const expected = "id";

    expect(getProp(props, prop, options)).toHaveProperty("name.name", expected);
  });

  it("should return undefined if the attribute does not exist in spread (case sensitive)", () => {
    const code = '<div {...{ id: "foo" }} />';
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = "ID";
    const options = { ignoreCase: false };

    const expected = undefined;
    const actual = getProp(props, prop, options);

    expect(actual).toEqual(expected);
  });

  it("should return undefined for key in spread", () => {
    // https://github.com/reactjs/rfcs/pull/107
    const code = "<div {...{ key }} />";
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = "key";

    const expected = undefined;
    const actual = getProp(props, prop);

    expect(actual).toEqual(expected);
  });

  it("should return undefined if the attribute may exist in spread", () => {
    const code = "<div {...props} />";
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = "id";

    const expected = undefined;
    const actual = getProp(props, prop);

    expect(actual).toEqual(expected);
  });

  it("should not crash if the spread contains a spread", () => {
    const code = "<div {...{ ...props }} />";
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = "id";

    getProp(props, prop);
  });

  it("should return undefined if the attribute is considered absent in case-sensitive mode", () => {
    const code = '<div ID="foo" />';
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = "id";
    const options = {
      ignoreCase: false,
    };

    const expected = undefined;
    const actual = getProp(props, prop, options);

    expect(actual).toEqual(expected);
  });
});
