import { expect, describe, it, beforeEach } from "bun:test";

import hasProp, { hasAnyProp, hasEveryProp } from "../src/hasProp";
import { getOpeningElement, setParserName } from "./helper";

describe("hasProp", () => {
  beforeEach(() => {
    setParserName("babel");
  });
  it("should export a function", () => {
    const expected = "function";
    const actual = typeof hasProp;

    expect(actual).toEqual(expected);
  });

  it("should return false if no arguments are provided", () => {
    const expected = false;
    const actual = hasProp();

    expect(actual).toEqual(expected);
  });

  it("should return false if the prop is absent", () => {
    const code = "<div />";
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = "id";

    const expected = false;
    const actual = hasProp(props, prop);

    expect(actual).toEqual(expected);
  });

  it("should return true if the prop exists", () => {
    const code = '<div id="foo" />';
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = "id";

    const expected = true;
    const actual = hasProp(props, prop);

    expect(actual).toEqual(expected);
  });

  it("should return true if the prop may exist in spread loose mode", () => {
    const code = "<div {...props} />";
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = "id";
    const options = {
      spreadStrict: false,
    };

    const expected = true;
    const actual = hasProp(props, prop, options);

    expect(actual).toEqual(expected);
  });

  it("should return false if the prop is considered absent in case-sensitive mode", () => {
    const code = '<div ID="foo" />';
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = "id";
    const options = {
      ignoreCase: false,
    };

    const expected = false;
    const actual = hasProp(props, prop, options);

    expect(actual).toEqual(expected);
  });
});

describe("hasAnyProp tests", () => {
  it("should export a function", () => {
    const expected = "function";
    const actual = typeof hasAnyProp;

    expect(actual).toEqual(expected);
  });

  it("should return false if no arguments are provided", () => {
    const expected = false;
    const actual = hasAnyProp();

    expect(actual).toEqual(expected);
  });

  it("should return false if the prop is absent", () => {
    const code = "<div />";
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = "id";

    const expected = false;
    const actual = hasAnyProp(props, prop);

    expect(actual).toEqual(expected);
  });

  it("should return false if all props are absent in array", () => {
    const code = "<div />";
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const propsToCheck = ["id", "className"];

    const expected = false;
    const actual = hasAnyProp(props, propsToCheck);

    expect(actual).toEqual(expected);
  });

  it("should return false if all props are absent in space delimited string", () => {
    const code = "<div />";
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const propsToCheck = "id className";

    const expected = false;
    const actual = hasAnyProp(props, propsToCheck);

    expect(actual).toEqual(expected);
  });

  it("should return true if the prop exists", () => {
    const code = '<div id="foo" />';
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = "id";

    const expected = true;
    const actual = hasAnyProp(props, prop);

    expect(actual).toEqual(expected);
  });

  it("should return true if any prop exists in array", () => {
    const code = '<div id="foo" />';
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = ["className", "id"];

    const expected = true;
    const actual = hasAnyProp(props, prop);

    expect(actual).toEqual(expected);
  });

  it("should return true if any prop exists in space delimited string", () => {
    const code = '<div id="foo" />';
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = "className id";

    const expected = true;
    const actual = hasAnyProp(props, prop);

    expect(actual).toEqual(expected);
  });

  it("should return true if the prop may exist in spread loose mode", () => {
    const code = "<div {...props} />";
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = "id";
    const options = {
      spreadStrict: false,
    };

    const expected = true;
    const actual = hasAnyProp(props, prop, options);

    expect(actual).toEqual(expected);
  });

  it("should return true if any prop may exist in spread loose mode", () => {
    const code = "<div {...props} />";
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = ["id", "className"];
    const options = {
      spreadStrict: false,
    };

    const expected = true;
    const actual = hasAnyProp(props, prop, options);

    expect(actual).toEqual(expected);
  });

  it("should return false if the prop is considered absent in case-sensitive mode", () => {
    const code = '<div ID="foo" />';
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = "id";
    const options = {
      ignoreCase: false,
    };

    const expected = false;
    const actual = hasAnyProp(props, prop, options);

    expect(actual).toEqual(expected);
  });

  it("should return false if all props are considered absent in case-sensitive mode", () => {
    const code = '<div ID="foo" />';
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = ["id", "iD", "className"];
    const options = {
      ignoreCase: false,
    };

    const expected = false;
    const actual = hasAnyProp(props, prop, options);

    expect(actual).toEqual(expected);
  });
});

describe("hasEveryProp tests", () => {
  it("should export a function", () => {
    const expected = "function";
    const actual = typeof hasEveryProp;

    expect(actual).toEqual(expected);
  });

  it("should return true if no arguments are provided", () => {
    const expected = true;
    const actual = hasEveryProp();

    expect(actual).toEqual(expected);
  });

  it("should return false if the prop is absent", () => {
    const code = "<div />";
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = "id";

    const expected = false;
    const actual = hasEveryProp(props, prop);

    expect(actual).toEqual(expected);
  });

  it("should return false if any props are absent in array", () => {
    const code = '<div id="foo" />';
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const propsToCheck = ["id", "className"];

    const expected = false;
    const actual = hasEveryProp(props, propsToCheck);

    expect(actual).toEqual(expected);
  });

  it("should return false if all props are absent in array", () => {
    const code = "<div />";
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const propsToCheck = ["id", "className"];

    const expected = false;
    const actual = hasEveryProp(props, propsToCheck);

    expect(actual).toEqual(expected);
  });

  it("should return false if any props are absent in space delimited string", () => {
    const code = '<div id="foo" />';
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const propsToCheck = "id className";

    const expected = false;
    const actual = hasEveryProp(props, propsToCheck);

    expect(actual).toEqual(expected);
  });

  it("should return false if all props are absent in space delimited string", () => {
    const code = "<div />";
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const propsToCheck = "id className";

    const expected = false;
    const actual = hasEveryProp(props, propsToCheck);

    expect(actual).toEqual(expected);
  });

  it("should return true if the prop exists", () => {
    const code = '<div id="foo" />';
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = "id";

    const expected = true;
    const actual = hasEveryProp(props, prop);

    expect(actual).toEqual(expected);
  });

  it("should return true if all props exist in array", () => {
    const code = '<div id="foo" className="box" />';
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = ["className", "id"];

    const expected = true;
    const actual = hasEveryProp(props, prop);

    expect(actual).toEqual(expected);
  });

  it("should return true if all props exist in space delimited string", () => {
    const code = '<div id="foo" className="box" />';
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = "className id";

    const expected = true;
    const actual = hasEveryProp(props, prop);

    expect(actual).toEqual(expected);
  });

  it("should return true if the props may exist in spread loose mode", () => {
    const code = "<div {...props} />";
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = "id";
    const options = {
      spreadStrict: false,
    };

    const expected = true;
    const actual = hasEveryProp(props, prop, options);

    expect(actual).toEqual(expected);
  });

  it("should return true if all props may exist in spread loose mode", () => {
    const code = "<div {...props} />";
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = ["id", "className"];
    const options = {
      spreadStrict: false,
    };

    const expected = true;
    const actual = hasEveryProp(props, prop, options);

    expect(actual).toEqual(expected);
  });

  it("should return false if the prop is considered absent in case-sensitive mode", () => {
    const code = '<div ID="foo" />';
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = "id";
    const options = {
      ignoreCase: false,
    };

    const expected = false;
    const actual = hasEveryProp(props, prop, options);

    expect(actual).toEqual(expected);
  });

  it("should return false if all props are considered absent in case-sensitive mode", () => {
    const code = '<div ID="foo" />';
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = ["id", "iD", "className"];
    const options = {
      ignoreCase: false,
    };

    const expected = false;
    const actual = hasEveryProp(props, prop, options);

    expect(actual).toEqual(expected);
  });

  it("should return true if all props are considered present in case-sensitive mode", () => {
    const code = '<div ID="foo" className="box" />';
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = ["ID", "className"];
    const options = {
      ignoreCase: false,
    };

    const expected = true;
    const actual = hasEveryProp(props, prop, options);

    expect(actual).toEqual(expected);
  });
});
