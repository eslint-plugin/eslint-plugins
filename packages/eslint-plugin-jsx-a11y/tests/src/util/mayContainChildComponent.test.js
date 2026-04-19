import { describe, expect, it } from "bun:test";

import JSXAttributeMock from "../../../__mocks__/JSXAttributeMock";
import JSXElementMock from "../../../__mocks__/JSXElementMock";
import JSXExpressionContainerMock from "../../../__mocks__/JSXExpressionContainerMock";
import mayContainChildComponent from "../../../src/util/mayContainChildComponent";

describe("mayContainChildComponent", () => {
  it("returns false if FancyComponent is not present", () => {
    const element = JSXElementMock(
      "div",
      [],
      [
        JSXElementMock(
          "div",
          [],
          [
            JSXElementMock("span", [], []),
            JSXElementMock(
              "span",
              [],
              [
                JSXElementMock("span", [], []),
                JSXElementMock("span", [], [JSXElementMock("span", [], [])]),
              ],
            ),
          ],
        ),
        JSXElementMock("span", [], []),
        JSXElementMock("img", [JSXAttributeMock("src", "some/path")]),
      ],
    );

    expect(mayContainChildComponent(element, "FancyComponent", 5)).toBe(false);
  });

  describe("contains an indicated component", () => {
    it("returns true for a direct child input", () => {
      expect(
        mayContainChildComponent(
          JSXElementMock("div", [], [JSXElementMock("input")]),
          "input",
        ),
      ).toBe(true);
    });

    it("returns true for a direct child FancyComponent", () => {
      expect(
        mayContainChildComponent(
          JSXElementMock("div", [], [JSXElementMock("FancyComponent")]),
          "FancyComponent",
        ),
      ).toBe(true);
    });

    it("returns false if FancyComponent is outside of default depth", () => {
      const element = JSXElementMock(
        "div",
        [],
        [JSXElementMock("div", [], [JSXElementMock("FancyComponent")])],
      );
      expect(mayContainChildComponent(element, "FancyComponent")).toBe(false);
    });

    it("returns true if FancyComponent is inside of custom depth", () => {
      const element = JSXElementMock(
        "div",
        [],
        [JSXElementMock("div", [], [JSXElementMock("FancyComponent")])],
      );
      expect(mayContainChildComponent(element, "FancyComponent", 2)).toBe(true);
    });

    it("returns true for deep nesting within depth limit", () => {
      const element = JSXElementMock(
        "div",
        [],
        [
          JSXElementMock(
            "div",
            [],
            [
              JSXElementMock("span", [], []),
              JSXElementMock(
                "span",
                [],
                [
                  JSXElementMock("span", [], []),
                  JSXElementMock(
                    "span",
                    [],
                    [
                      JSXElementMock(
                        "span",
                        [],
                        [
                          JSXElementMock(
                            "span",
                            [],
                            [JSXElementMock("FancyComponent")],
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
          JSXElementMock("span", [], []),
          JSXElementMock("img", [JSXAttributeMock("src", "some/path")]),
        ],
      );
      expect(mayContainChildComponent(element, "FancyComponent", 6)).toBe(true);
    });
  });

  it("returns true for indeterminate situations with expression container children", () => {
    expect(
      mayContainChildComponent(
        JSXElementMock("div", [], [JSXExpressionContainerMock("mysteryBox")]),
        "FancyComponent",
      ),
    ).toBe(true);
  });

  describe("Glob name matching", () => {
    describe("match any single character (?)", () => {
      it("returns true when ? matches correctly", () => {
        expect(
          mayContainChildComponent(
            JSXElementMock("div", [], [JSXElementMock("FancyComponent")]),
            "Fanc?Co??onent",
          ),
        ).toBe(true);
      });

      it("returns false when ? does not match (extra character)", () => {
        expect(
          mayContainChildComponent(
            JSXElementMock("div", [], [JSXElementMock("FancyComponent")]),
            "FancyComponent?",
          ),
        ).toBe(false);
      });
    });

    describe("match zero or more characters (*)", () => {
      it("matches trailing characters", () => {
        expect(
          mayContainChildComponent(
            JSXElementMock("div", [], [JSXElementMock("FancyComponent")]),
            "Fancy*",
          ),
        ).toBe(true);
      });

      it("matches leading characters", () => {
        expect(
          mayContainChildComponent(
            JSXElementMock("div", [], [JSXElementMock("FancyComponent")]),
            "*Component",
          ),
        ).toBe(true);
      });

      it("matches characters in the middle", () => {
        expect(
          mayContainChildComponent(
            JSXElementMock("div", [], [JSXElementMock("FancyComponent")]),
            "Fancy*C*t",
          ),
        ).toBe(true);
      });
    });
  });

  describe("using a custom elementType function", () => {
    it("returns true when the custom elementType returns the proper name", () => {
      expect(
        mayContainChildComponent(
          JSXElementMock("div", [], [JSXElementMock("CustomInput")]),
          "input",
          2,
          () => "input",
        ),
      ).toBe(true);
    });

    it("returns false when the custom elementType returns a wrong name", () => {
      expect(
        mayContainChildComponent(
          JSXElementMock("div", [], [JSXElementMock("CustomInput")]),
          "input",
          2,
          () => "button",
        ),
      ).toBe(false);
    });
  });
});
