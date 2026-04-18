import { expect, describe, beforeEach, it } from "bun:test";

import elementType from "../src/elementType";
import { getOpeningElement, setParserName } from "./helper";

describe("elementType tests", () => {
  beforeEach(() => {
    setParserName("babel");
  });
  it("should export a function", () => {
    const expected = "function";
    const actual = typeof elementType;

    expect(actual).toEqual(expected);
  });

  it("should throw an error if the argument is missing", () => {
    expect(() => {
      // @ts-expect-error
      elementType();
    }).toThrow(Error);
  });

  it("should throw an error if the argument not a JSX node", () => {
    expect(() => {
      // @ts-expect-error
      elementType({ a: "foo" });
    }).toThrow(Error);
  });

  it("should return the correct type of the DOM element given its node object", () => {
    const code = "<div />";
    const node = getOpeningElement(code);

    const expected = "div";
    const actual = elementType(node);

    expect(actual).toEqual(expected);
  });

  it("should return the correct type of the custom element given its node object", () => {
    const code = "<Slider />";
    const node = getOpeningElement(code);

    const expected = "Slider";
    const actual = elementType(node);

    expect(actual).toEqual(expected);
  });

  it("should return the correct type of the custom object element given its node object", () => {
    const code = "<UX.Slider />";
    const node = getOpeningElement(code);

    const expected = "UX.Slider";
    const actual = elementType(node);

    expect(actual).toEqual(expected);
  });

  it("should return the correct type of the namespaced element given its node object", () => {
    const code = "<UX:Slider />";
    const node = getOpeningElement(code);

    const expected = "UX:Slider";
    const actual = elementType(node);

    expect(actual).toEqual(expected);
  });

  it("should return the correct type of the multiple custom object element given its node object", () => {
    const code = "<UX.Slider.Blue.Light />";
    const node = getOpeningElement(code);

    const expected = "UX.Slider.Blue.Light";
    const actual = elementType(node);

    expect(actual).toEqual(expected);
  });

  it("should return this.Component when given its node object", () => {
    const code = "<this.Component />";
    const node = getOpeningElement(code);

    const expected = "this.Component";
    const actual = elementType(node);

    expect(actual).toEqual(expected);
  });

  describe("fragments", () => {
    it("should work with fragments", () => {
      const code = "<>foo</>";
      const node = getOpeningElement(code);

      const expected = "<>";
      const actual = elementType(node);

      expect(actual).toEqual(expected);
    });

    it("works with nested fragments", () => {
      const code = `
        <Hello
          role="checkbox"
          frag={
            <>
              <div>Hello</div>
              <>
                <div>There</div>
              </>
            </>
          }
        />
      `;
      const node = getOpeningElement(code);

      const expected = "Hello";
      const actual = elementType(node);

      expect(actual).toEqual(expected);
    });
  });
});
