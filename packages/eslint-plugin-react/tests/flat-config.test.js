import { expect, describe, it } from "bun:test";

const semver = require("semver");
const eslintPkg = require("eslint/package.json");

const ESLint =
  semver.major(eslintPkg.version) < 9
    ? require("eslint/use-at-your-own-risk").FlatESLint // eslint-disable-line import/no-unresolved -- false positive
    : require("eslint").ESLint;

const path = require("node:path");

describe.skipIf(!semver.satisfies(eslintPkg.version, ">= 8.23.0"))(
  "eslint-plugin-react in flat config",
  () => {
    const fixturesdDir = path.resolve(__dirname, "fixtures", "flat-config");

    it("should work when the plugin is used directly", () => {
      const eslint = new ESLint({
        cwd: path.resolve(fixturesdDir, "plugin"),
      });

      return eslint.lintFiles(["test.jsx"]).then((results) => {
        const result = results[0];

        expect(result.messages.length).toBe(1);
        expect(result.messages[0].severity).toBe(1);
        expect(result.messages[0].ruleId).toBe("react/jsx-no-literals");
        expect(result.messages[0].messageId).toBe("literalNotInJSXExpression");
      });
    });

    ["root", "deep"].forEach((configAccess) => {
      const overrideConfigFile = `eslint.config-${configAccess}.js`;

      it(`should work when the plugin is used with "all" config (${configAccess})`, () => {
        const eslint = new ESLint({
          cwd: path.resolve(fixturesdDir, "config-all"),
          overrideConfigFile,
        });

        return eslint.lintFiles(["test.jsx"]).then((results) => {
          const result = results[0];

          expect(result.messages.length).toBe(3);
          expect(result.messages[0].severity).toBe(2);
          expect(result.messages[0].ruleId).toBe("react/react-in-jsx-scope");
          expect(result.messages[0].messageId).toBe("notInScope");
          expect(result.messages[1].severity).toBe(2);
          expect(result.messages[1].ruleId).toBe("react/no-unknown-property");
          expect(result.messages[1].messageId).toBe("unknownProp");
          expect(result.messages[2].severity).toBe(2);
          expect(result.messages[2].ruleId).toBe("react/jsx-no-literals");
          expect(result.messages[2].messageId).toBe(
            "literalNotInJSXExpression",
          );
        });
      });

      it(`should work when the plugin is used with "recommended" config (${configAccess})`, () => {
        const eslint = new ESLint({
          cwd: path.resolve(fixturesdDir, "config-recommended"),
          overrideConfigFile,
        });

        return eslint.lintFiles(["test.jsx"]).then((results) => {
          const result = results[0];

          expect(result.messages.length).toBe(2);
          expect(result.messages[0].severity).toBe(2);
          expect(result.messages[0].ruleId).toBe("react/react-in-jsx-scope");
          expect(result.messages[0].messageId).toBe("notInScope");
          expect(result.messages[1].severity).toBe(2);
          expect(result.messages[1].ruleId).toBe("react/no-unknown-property");
          expect(result.messages[1].messageId).toBe("unknownProp");
        });
      });

      it(`should work when the plugin is used with "recommended" and "jsx-runtime" configs (${configAccess})`, () => {
        const eslint = new ESLint({
          cwd: path.resolve(fixturesdDir, "config-jsx-runtime"),
          overrideConfigFile,
        });

        return eslint.lintFiles(["test.jsx"]).then((results) => {
          const result = results[0];

          expect(result.messages.length).toBe(1);
          expect(result.messages[0].severity).toBe(2);
          expect(result.messages[0].ruleId).toBe("react/no-unknown-property");
          expect(result.messages[0].messageId).toBe("unknownProp");
        });
      });

      // https://github.com/jsx-eslint/eslint-plugin-react/issues/3693
      it(`should work when the plugin is used directly and with "recommended" config (${configAccess})`, () => {
        const eslint = new ESLint({
          cwd: path.resolve(fixturesdDir, "plugin-and-config"),
          overrideConfigFile,
        });

        return eslint.lintFiles(["test.jsx"]).then((results) => {
          const result = results[0];

          expect(result.messages.length).toBe(2);
          expect(result.messages[0].severity).toBe(2);
          expect(result.messages[0].ruleId).toBe("react/react-in-jsx-scope");
          expect(result.messages[0].messageId).toBe("notInScope");
          expect(result.messages[1].severity).toBe(2);
          expect(result.messages[1].ruleId).toBe("react/no-unknown-property");
          expect(result.messages[1].messageId).toBe("unknownProp");
        });
      });
    });
  },
);
