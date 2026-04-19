import { expect, describe, it } from "bun:test";

const fs = require("node:fs");
const path = require("node:path");

const plugin = require("../src/index");
const index = require("../src/rules");

const ruleFiles = fs
  .readdirSync(path.resolve(__dirname, "../src/rules/"))
  .filter((f) => f.endsWith(".js"))
  .map((f) => path.basename(f, ".js"))
  .filter((f) => f !== "index");

describe("all rule files should be exported by the plugin", () => {
  ruleFiles.forEach((ruleName) => {
    it(`should export ${ruleName}`, () => {
      expect(plugin.rules[ruleName]).toEqual(
        require(path.join("../src/rules", ruleName)), // eslint-disable-line global-require, import/no-dynamic-require
      );
    });

    it(`should export ${ruleName} from src/rules/index`, () => {
      expect(plugin.rules[ruleName]).toEqual(index[ruleName]);
    });
  });
});

describe("deprecated rules", () => {
  describe("marks all deprecated rules as deprecated", () => {
    ruleFiles.forEach((ruleName) => {
      const inDeprecatedRules = !!plugin.deprecatedRules[ruleName];
      const isDeprecated = plugin.rules[ruleName].meta.deprecated;
      if (inDeprecatedRules) {
        it(`${ruleName} metadata should mark it as deprecated`, () => {
          expect(isDeprecated).toBeTrue();
        });
      } else {
        it(`${ruleName} metadata should not mark it as deprecated`, () => {
          expect(isDeprecated).toBeUndefined();
        });
      }
    });
  });
});

describe("configurations", () => {
  describe("should export a ‘recommended’ configuration", () => {
    const configName = "recommended";
    expect(plugin.configs[configName]).toBeDefined();

    Object.keys(plugin.configs[configName].rules).forEach((ruleName) => {
      expect(ruleName).toStartWith("react/");
      const subRuleName = ruleName.slice("react/".length);
      expect(plugin.rules[subRuleName]).toBeDefined();
    });

    ruleFiles.forEach((ruleName) => {
      const inRecommendedConfig =
        !!plugin.configs[configName].rules[`react/${ruleName}`];
      const isRecommended = plugin.rules[ruleName].meta.docs[configName];
      if (inRecommendedConfig) {
        it(`${ruleName} metadata should mark it as recommended`, () => {
          expect(isRecommended).toBeTrue();
        });
      } else {
        it(`${ruleName} metadata should not mark it as recommended`, () => {
          expect(isRecommended).toBeOneOf([false, undefined]);
        });
      }
    });
  });

  it("should export an ‘all’ configuration", () => {
    const configName = "all";
    expect(plugin.configs[configName]).toBeDefined();

    Object.keys(plugin.configs[configName].rules).forEach((ruleName) => {
      expect(ruleName).toStartWith("react/");
      expect(plugin.configs[configName].rules[ruleName]).toBe(2);
    });

    ruleFiles.forEach((ruleName) => {
      const inDeprecatedRules = !!plugin.deprecatedRules[ruleName];
      const inConfig =
        typeof plugin.configs[configName].rules[`react/${ruleName}`] !==
        "undefined";
      expect(inDeprecatedRules ^ inConfig).toBe(1);
    });
  });

  it("should export a ‘jsx-runtime’ configuration", () => {
    const configName = "jsx-runtime";
    expect(plugin.configs[configName]).toBeDefined();

    Object.keys(plugin.configs[configName].rules).forEach((ruleName) => {
      expect(ruleName).toStartWith("react/");
      expect(plugin.configs[configName].rules[ruleName]).toBe(0);

      const inDeprecatedRules = !!plugin.deprecatedRules[ruleName];
      const inConfig =
        typeof plugin.configs[configName].rules[ruleName] !== "undefined";
      expect(inDeprecatedRules ^ inConfig).toBe(1);
    });
  });
});
