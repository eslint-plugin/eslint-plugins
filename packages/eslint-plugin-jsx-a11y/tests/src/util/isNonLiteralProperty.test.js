import { describe, expect, it } from "bun:test";

import IdentifierMock from "../../../__mocks__/IdentifierMock";
import JSXAttributeMock from "../../../__mocks__/JSXAttributeMock";
import JSXSpreadAttributeMock from "../../../__mocks__/JSXSpreadAttributeMock";
import JSXTextMock from "../../../__mocks__/JSXTextMock";
import LiteralMock from "../../../__mocks__/LiteralMock";
import isNonLiteralProperty from "../../../src/util/isNonLiteralProperty";

const theProp = "theProp";
const spread = JSXSpreadAttributeMock("theSpread");

describe("isNonLiteralProperty", () => {
  it("does not identify empty attributes as non-literal role elements", () => {
    expect(isNonLiteralProperty([], theProp)).toBe(false);
  });

  it("does not identify elements with a literal property as non-literal role elements without spread operator", () => {
    const attributes = [JSXAttributeMock(theProp, LiteralMock("theRole"))];
    expect(isNonLiteralProperty(attributes, theProp)).toBe(false);
  });

  it("does not identify elements with a literal property as non-literal role elements with spread operator", () => {
    const attributes = [
      spread,
      JSXAttributeMock(theProp, LiteralMock("theRole")),
    ];
    expect(isNonLiteralProperty(attributes, theProp)).toBe(false);
  });

  it("identifies elements with a JSXText property as non-literal role elements", () => {
    const attributes = [JSXAttributeMock(theProp, JSXTextMock("theRole"))];
    expect(isNonLiteralProperty(attributes, theProp)).toBe(false);
  });

  it("does not identify elements with a property of undefined as non-literal role elements", () => {
    const attributes = [JSXAttributeMock(theProp, IdentifierMock("undefined"))];
    expect(isNonLiteralProperty(attributes, theProp)).toBe(false);
  });

  it("identifies elements with an expression property as non-literal role elements", () => {
    const attributes = [
      JSXAttributeMock(theProp, IdentifierMock("theIdentifier")),
    ];
    expect(isNonLiteralProperty(attributes, theProp)).toBe(true);
  });
});
