import { describe, expect, it } from "bun:test";

import JSXAttributeMock from "../../../__mocks__/JSXAttributeMock";
import isSemanticRoleElement from "../../../src/util/isSemanticRoleElement";

describe("isSemanticRoleElement", () => {
  it("identifies semantic role elements", () => {
    const attributes = [
      JSXAttributeMock("type", "checkbox"),
      JSXAttributeMock("role", "switch"),
    ];
    expect(isSemanticRoleElement("input", attributes)).toBe(true);
  });

  describe("rejects non-semantics role elements", () => {
    it("rejects radio input with switch role", () => {
      const attributes = [
        JSXAttributeMock("type", "radio"),
        JSXAttributeMock("role", "switch"),
      ];
      expect(isSemanticRoleElement("input", attributes)).toBe(false);
    });

    it("rejects text input with combobox role", () => {
      const attributes = [
        JSXAttributeMock("type", "text"),
        JSXAttributeMock("role", "combobox"),
      ];
      expect(isSemanticRoleElement("input", attributes)).toBe(false);
    });

    it("rejects button with switch role and aria-pressed", () => {
      const attributes = [
        JSXAttributeMock("role", "switch"),
        JSXAttributeMock("aria-pressed", "true"),
      ];
      expect(isSemanticRoleElement("button", attributes)).toBe(false);
    });

    it("rejects input with switch role but no type", () => {
      const attributes = [JSXAttributeMock("role", "switch")];
      expect(isSemanticRoleElement("input", attributes)).toBe(false);
    });
  });

  it("does not throw on JSXSpreadAttribute", () => {
    const attributes = [
      JSXAttributeMock("type", "checkbox"),
      JSXAttributeMock("role", "checkbox"),
      JSXAttributeMock("aria-checked", "false"),
      JSXAttributeMock("aria-labelledby", "foo"),
      JSXAttributeMock("tabindex", "0"),
      {
        type: "JSXSpreadAttribute",
        argument: {
          type: "Identifier",
          name: "props",
        },
      },
    ];

    expect(() => isSemanticRoleElement("input", attributes)).not.toThrow();
  });
});
