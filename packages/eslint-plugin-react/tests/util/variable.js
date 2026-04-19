"use strict";

const assert = require("node:assert");

const getLatestVariableDefinition =
  require("../../src/util/variable").getLatestVariableDefinition;

describe("variable", () => {
  describe("getLatestVariableDefinition", () => {
    it("should return undefined for empty definitions", () => {
      const variable = {
        defs: [],
      };
      assert.equal(getLatestVariableDefinition(variable), undefined);
    });

    it("should return the latest definition", () => {
      const variable = {
        defs: ["one", "two", "latest"],
      };
      assert.equal(getLatestVariableDefinition(variable), "latest");
    });
  });
});
