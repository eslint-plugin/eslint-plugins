import { describe, expect, it } from "bun:test";

import JSXAttributeMock from "../../../__mocks__/JSXAttributeMock";
import JSXElementMock from "../../../__mocks__/JSXElementMock";
import JSXExpressionContainerMock from "../../../__mocks__/JSXExpressionContainerMock";
import JSXSpreadAttributeMock from "../../../__mocks__/JSXSpreadAttributeMock";
import JSXTextMock from "../../../__mocks__/JSXTextMock";
import LiteralMock from "../../../__mocks__/LiteralMock";
import mayHaveAccessibleLabel from "../../../src/util/mayHaveAccessibleLabel";

describe("mayHaveAccessibleLabel", () => {
  it("returns false when no label is present", () => {
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

    expect(mayHaveAccessibleLabel(element, 5)).toBe(false);
  });

  describe("label via attributes", () => {
    it("returns true for aria-label with content", () => {
      const element = JSXElementMock(
        "div",
        [JSXAttributeMock("aria-label", "A delicate label")],
        [],
      );
      expect(mayHaveAccessibleLabel(element)).toBe(true);
    });

    it("returns false for empty aria-label", () => {
      const element = JSXElementMock(
        "div",
        [JSXAttributeMock("aria-label", "")],
        [],
      );
      expect(mayHaveAccessibleLabel(element)).toBe(false);
    });

    it("returns false for aria-label with only whitespace", () => {
      const space = JSXElementMock(
        "div",
        [JSXAttributeMock("aria-label", " ")],
        [],
      );
      const newline = JSXElementMock(
        "div",
        [JSXAttributeMock("aria-label", "\n")],
        [],
      );

      expect(mayHaveAccessibleLabel(space)).toBe(false);
      expect(mayHaveAccessibleLabel(newline)).toBe(false);
    });

    it("returns true for aria-labelledby", () => {
      const element = JSXElementMock(
        "div",
        [JSXAttributeMock("aria-labelledby", "elementId")],
        [],
      );
      expect(mayHaveAccessibleLabel(element)).toBe(true);
    });

    it("returns false for empty aria-labelledby", () => {
      const element = JSXElementMock(
        "div",
        [JSXAttributeMock("aria-labelledby", "")],
        [],
      );
      expect(mayHaveAccessibleLabel(element)).toBe(false);
    });

    it("returns true for aria-labelledby with an expression container", () => {
      const element = JSXElementMock(
        "div",
        [JSXAttributeMock("aria-labelledby", "elementId", true)],
        [],
      );
      expect(mayHaveAccessibleLabel(element)).toBe(true);
    });
  });

  describe("label via custom label attribute", () => {
    it("returns true for custom label attributes", () => {
      const customLabelProp = "cowbell";
      const element = JSXElementMock(
        "div",
        [JSXAttributeMock(customLabelProp, "A delicate label")],
        [],
      );
      expect(mayHaveAccessibleLabel(element, 1, [customLabelProp])).toBe(true);
    });
  });

  describe("text label", () => {
    it("returns true for Literal text", () => {
      const element = JSXElementMock("div", [], [LiteralMock("A fancy label")]);
      expect(mayHaveAccessibleLabel(element)).toBe(true);
    });

    it("returns false for Literal whitespace", () => {
      const space = JSXElementMock("div", [], [LiteralMock(" ")]);
      const newline = JSXElementMock("div", [], [LiteralMock("\n")]);

      expect(mayHaveAccessibleLabel(space)).toBe(false);
      expect(mayHaveAccessibleLabel(newline)).toBe(false);
    });

    it("returns true for JSXText", () => {
      const element = JSXElementMock("div", [], [JSXTextMock("A fancy label")]);
      expect(mayHaveAccessibleLabel(element)).toBe(true);
    });

    it("returns false if label is outside of default depth", () => {
      const element = JSXElementMock(
        "div",
        [],
        [JSXElementMock("div", [], [JSXTextMock("A fancy label")])],
      );
      expect(mayHaveAccessibleLabel(element)).toBe(false);
    });

    it("returns true if label is inside of custom depth", () => {
      const element = JSXElementMock(
        "div",
        [],
        [JSXElementMock("div", [], [JSXTextMock("A fancy label")])],
      );
      expect(mayHaveAccessibleLabel(element, 2)).toBe(true);
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
                            [JSXTextMock("A fancy label")],
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
          ),
        ],
      );
      expect(mayHaveAccessibleLabel(element, 6)).toBe(true);
    });
  });

  describe("image content", () => {
    it("returns false for images without alt", () => {
      const element = JSXElementMock(
        "div",
        [],
        [JSXElementMock("img", [JSXAttributeMock("src", "some/path")])],
      );
      expect(mayHaveAccessibleLabel(element)).toBe(false);
    });

    it("returns true for images with alt", () => {
      const element = JSXElementMock(
        "div",
        [],
        [
          JSXElementMock("img", [
            JSXAttributeMock("src", "some/path"),
            JSXAttributeMock("alt", "A sensible label"),
          ]),
        ],
      );
      expect(mayHaveAccessibleLabel(element)).toBe(true);
    });

    it("returns true for images with aria-label", () => {
      const element = JSXElementMock(
        "div",
        [],
        [
          JSXElementMock("img", [
            JSXAttributeMock("src", "some/path"),
            JSXAttributeMock("aria-label", "A sensible label"),
          ]),
        ],
      );
      expect(mayHaveAccessibleLabel(element)).toBe(true);
    });
  });

  describe("Indeterminate situations", () => {
    it("returns true for expression container children", () => {
      const element = JSXElementMock(
        "div",
        [],
        [JSXExpressionContainerMock("mysteryBox")],
      );
      expect(mayHaveAccessibleLabel(element)).toBe(true);
    });

    it("returns true for spread operator in attributes", () => {
      const element = JSXElementMock(
        "div",
        [
          JSXAttributeMock("style", "some-junk"),
          JSXSpreadAttributeMock("props"),
        ],
        [],
      );
      expect(mayHaveAccessibleLabel(element)).toBe(true);
    });
  });
});
