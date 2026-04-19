import { describe, it, expect } from "bun:test";
const getLatestVariableDefinition =
  require("../../src/util/variable").getLatestVariableDefinition;

describe("variable", () => {
  describe("getLatestVariableDefinition", () => {
    it("should return undefined for empty definitions", () => {
      const variable = {
        defs: [],
      };
      expect(getLatestVariableDefinition(variable)).toBeUndefined();
    });

    it("should return the latest definition", () => {
      const variable = {
        defs: ["one", "two", "latest"],
      };
      expect(getLatestVariableDefinition(variable)).toBe("latest");
    });
  });
});
