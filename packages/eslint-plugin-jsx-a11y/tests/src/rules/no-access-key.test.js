/**
 * @fileoverview Enforce no accesskey attribute on element.
 * @author Ethan Cohen
 */

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import rule from "../../../src/rules/no-access-key";
import { eslintBefore10 } from "../../__util__/eslint-version";
import parsers from "../../__util__/helpers/parsers";
import parserOptionsMapper from "../../__util__/parserOptionsMapper";
import RuleTester from "../../__util__/RuleTester";

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester();

const expectedError = {
  message:
    "No access key attribute allowed. Inconsistencies between keyboard shortcuts and keyboard commands used by screen readers and keyboard-only users create a11y complications.",
};

if (eslintBefore10) {
  expectedError.type = "JSXOpeningElement";
}

ruleTester.run("no-access-key", rule, {
  valid: parsers
    .all(
      [].concat(
        { code: "<div />;" },
        { code: "<div {...props} />" },
        { code: "<div accessKey={undefined} />" },
      ),
    )
    .map(parserOptionsMapper),
  invalid: parsers
    .all(
      [].concat(
        { code: '<div accesskey="h" />', errors: [expectedError] },
        { code: '<div accessKey="h" />', errors: [expectedError] },
        { code: '<div accessKey="h" {...props} />', errors: [expectedError] },
        { code: '<div acCesSKeY="y" />', errors: [expectedError] },
        { code: '<div accessKey={"y"} />', errors: [expectedError] },
        { code: "<div accessKey={`${y}`} />", errors: [expectedError] },
        {
          code: "<div accessKey={`${undefined}y${undefined}`} />",
          errors: [expectedError],
        },
        {
          code: "<div accessKey={`This is ${bad}`} />",
          errors: [expectedError],
        },
        { code: "<div accessKey={accessKey} />", errors: [expectedError] },
        { code: "<div accessKey={`${undefined}`} />", errors: [expectedError] },
        {
          code: "<div accessKey={`${undefined}${undefined}`} />",
          errors: [expectedError],
        },
      ),
    )
    .map(parserOptionsMapper),
});
