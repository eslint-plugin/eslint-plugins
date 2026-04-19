import { describe, expect, it } from "bun:test";

import { RuleTester } from "eslint";
import { eslintBefore10 } from "./eslint-version";

if (eslintBefore10) {
  const orig = RuleTester.prototype.run;
  RuleTester.prototype.run = function (name, rule, tests) {
    describe(`RuleTester: ${name}`, () => {
      orig.call(this, name, rule, tests);
    });
  };

  RuleTester.describe = function (text, method) {
    describe(text, () => {
      method.call(this);
    });
  };

  RuleTester.it = function (text, method) {
    it(text, () => {
      expect(method).not.toThrow();
    });
  };
} else {
  RuleTester.describe = describe;
  RuleTester.it = it;
}

export default RuleTester;
