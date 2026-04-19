import { describe, it, expect } from "bun:test";
const propWrapperUtil = require("../../src/util/propWrapper");

describe("PropWrapperFunctions", () => {
  describe("getPropWrapperFunctions", () => {
    it("returns set of functions if setting exists", () => {
      const propWrapperFunctions = [
        "Object.freeze",
        {
          property: "forbidExtraProps",
        },
      ];
      const context = {
        settings: {
          propWrapperFunctions,
        },
      };
      expect(propWrapperUtil.getPropWrapperFunctions(context)).toEqual(
        new Set(propWrapperFunctions),
      );
    });

    it("returns empty set if no setting", () => {
      const context = {
        settings: {},
      };
      expect(propWrapperUtil.getPropWrapperFunctions(context)).toEqual(
        new Set([]),
      );
    });
  });

  describe("isPropWrapperFunction", () => {
    it("with string", () => {
      const context = {
        settings: {
          propWrapperFunctions: ["Object.freeze"],
        },
      };
      expect(
        propWrapperUtil.isPropWrapperFunction(context, "Object.freeze"),
      ).toBe(true);
    });

    it("with Object with object and property keys", () => {
      const context = {
        settings: {
          propWrapperFunctions: [
            {
              property: "freeze",
              object: "Object",
            },
          ],
        },
      };
      expect(
        propWrapperUtil.isPropWrapperFunction(context, "Object.freeze"),
      ).toBe(true);
    });

    it("with Object with only property key", () => {
      const context = {
        settings: {
          propWrapperFunctions: [
            {
              property: "forbidExtraProps",
            },
          ],
        },
      };
      expect(
        propWrapperUtil.isPropWrapperFunction(context, "forbidExtraProps"),
      ).toBe(true);
    });
  });

  describe("getExactPropWrapperFunctions", () => {
    it("returns set of functions if setting exists", () => {
      const propWrapperFunctions = [
        "Object.freeze",
        {
          property: "forbidExtraProps",
          exact: true,
        },
      ];
      const context = {
        settings: {
          propWrapperFunctions,
        },
      };
      expect(propWrapperUtil.getExactPropWrapperFunctions(context)).toEqual(
        new Set([
          {
            property: "forbidExtraProps",
            exact: true,
          },
        ]),
      );
    });

    it("returns empty set if no exact prop wrappers", () => {
      const propWrapperFunctions = [
        "Object.freeze",
        {
          property: "forbidExtraProps",
        },
      ];
      const context = {
        settings: {
          propWrapperFunctions,
        },
      };
      expect(propWrapperUtil.getExactPropWrapperFunctions(context)).toEqual(
        new Set([]),
      );
    });

    it("returns empty set if no setting", () => {
      const context = {
        settings: {},
      };
      expect(propWrapperUtil.getExactPropWrapperFunctions(context)).toEqual(
        new Set([]),
      );
    });
  });

  describe("isExactPropWrapperFunction", () => {
    it("with string", () => {
      const context = {
        settings: {
          propWrapperFunctions: ["Object.freeze"],
        },
      };
      expect(
        propWrapperUtil.isExactPropWrapperFunction(context, "Object.freeze"),
      ).toBe(false);
    });

    it("with Object with object and property keys", () => {
      const context = {
        settings: {
          propWrapperFunctions: [
            {
              property: "freeze",
              object: "Object",
              exact: true,
            },
          ],
        },
      };
      expect(
        propWrapperUtil.isExactPropWrapperFunction(context, "Object.freeze"),
      ).toBe(true);
    });

    it("with Object with only property key", () => {
      const context = {
        settings: {
          propWrapperFunctions: [
            {
              property: "forbidExtraProps",
              exact: true,
            },
          ],
        },
      };
      expect(
        propWrapperUtil.isExactPropWrapperFunction(context, "forbidExtraProps"),
      ).toBe(true);
    });
  });

  describe("formatPropWrapperFunctions", () => {
    it("with empty set", () => {
      const propWrappers = new Set([]);
      expect(propWrapperUtil.formatPropWrapperFunctions(propWrappers)).toBe("");
    });

    it("with all allowed values", () => {
      const propWrappers = new Set([
        "Object.freeze",
        {
          property: "exact",
          exact: true,
        },
        {
          property: "bar",
          object: "foo",
        },
      ]);
      expect(propWrapperUtil.formatPropWrapperFunctions(propWrappers)).toBe(
        "'Object.freeze', 'exact', 'foo.bar'",
      );
    });
  });
});
