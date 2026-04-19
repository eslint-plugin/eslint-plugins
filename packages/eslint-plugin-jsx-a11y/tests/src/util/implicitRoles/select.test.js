import { describe, expect, it } from "bun:test";

import JSXAttributeMock from "../../../../__mocks__/JSXAttributeMock";
import getImplicitRoleForSelect from "../../../../src/util/implicitRoles/select";

describe("isAbstractRole", () => {
  describe("works for combobox", () => {
    it("defaults to combobox", () => {
      expect(getImplicitRoleForSelect([])).toBe("combobox");
    });

    it("is combobox when multiple attribute is set to not be present", () => {
      expect(
        getImplicitRoleForSelect([JSXAttributeMock("multiple", null)]),
      ).toBe("combobox");
      expect(
        getImplicitRoleForSelect([JSXAttributeMock("multiple", undefined)]),
      ).toBe("combobox");
    });

    it("is combobox when multiple attribute is set to boolean false", () => {
      expect(
        getImplicitRoleForSelect([JSXAttributeMock("multiple", false)]),
      ).toBe("combobox");
    });

    it("is listbox when multiple attribute is falsey (empty string)", () => {
      expect(getImplicitRoleForSelect([JSXAttributeMock("multiple", "")])).toBe(
        "combobox",
      );
    });

    it("is combobox when size is not greater than 1", () => {
      expect(getImplicitRoleForSelect([JSXAttributeMock("size", "1")])).toBe(
        "combobox",
      );
      expect(getImplicitRoleForSelect([JSXAttributeMock("size", 1)])).toBe(
        "combobox",
      );
      expect(getImplicitRoleForSelect([JSXAttributeMock("size", 0)])).toBe(
        "combobox",
      );
      expect(getImplicitRoleForSelect([JSXAttributeMock("size", "0")])).toBe(
        "combobox",
      );
      expect(getImplicitRoleForSelect([JSXAttributeMock("size", "-1")])).toBe(
        "combobox",
      );
    });

    it("is combobox when size is a valid number", () => {
      expect(getImplicitRoleForSelect([JSXAttributeMock("size", "")])).toBe(
        "combobox",
      );
      expect(getImplicitRoleForSelect([JSXAttributeMock("size", "true")])).toBe(
        "combobox",
      );
      expect(getImplicitRoleForSelect([JSXAttributeMock("size", true)])).toBe(
        "combobox",
      );
      expect(getImplicitRoleForSelect([JSXAttributeMock("size", NaN)])).toBe(
        "combobox",
      );
      expect(
        getImplicitRoleForSelect([JSXAttributeMock("size", undefined)]),
      ).toBe("combobox");
      expect(getImplicitRoleForSelect([JSXAttributeMock("size", false)])).toBe(
        "combobox",
      );
    });
  });

  describe("works for listbox based on multiple attribute", () => {
    it("is listbox when multiple is boolean true", () => {
      expect(
        getImplicitRoleForSelect([JSXAttributeMock("multiple", true)]),
      ).toBe("listbox");
    });

    it("is listbox when multiple is truthy (string)", () => {
      expect(
        getImplicitRoleForSelect([JSXAttributeMock("multiple", "multiple")]),
      ).toBe("listbox");
    });

    it("is listbox when multiple is truthy (string) - React will warn about this", () => {
      expect(
        getImplicitRoleForSelect([JSXAttributeMock("multiple", "true")]),
      ).toBe("listbox");
    });
  });

  describe("works for listbox based on size attribute", () => {
    it("is listbox when size is greater than 1", () => {
      expect(getImplicitRoleForSelect([JSXAttributeMock("size", 2)])).toBe(
        "listbox",
      );
      expect(getImplicitRoleForSelect([JSXAttributeMock("size", "3")])).toBe(
        "listbox",
      );
      expect(getImplicitRoleForSelect([JSXAttributeMock("size", 40)])).toBe(
        "listbox",
      );
    });
  });
});
