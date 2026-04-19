/**
 * @fileoverview Enforce distracting elements are not used.
 * @author Ethan Cohen
 */

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import rule from "../../../src/rules/no-distracting-elements";
import parsers from "../../__util__/helpers/parsers";
import parserOptionsMapper from "../../__util__/parserOptionsMapper";
import RuleTester from "../../__util__/RuleTester";

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester();

const expectedError = (element) => {
  return {
    message: `Do not use <${element}> elements as they can create visual accessibility issues and are deprecated.`,
    type: "JSXOpeningElement",
  };
};

const componentsSettings = {
  "jsx-a11y": {
    components: {
      Blink: "blink",
    },
  },
};

ruleTester.run("no-marquee", rule, {
  valid: parsers
    .all(
      [].concat(
        { code: "<div />;" },
        { code: "<Marquee />" },
        { code: "<div marquee />" },
        { code: "<Blink />" },
        { code: "<div blink />" },
      ),
    )
    .map(parserOptionsMapper),
  invalid: parsers
    .all(
      [].concat(
        { code: "<marquee />", errors: [expectedError("marquee")] },
        { code: "<marquee {...props} />", errors: [expectedError("marquee")] },
        {
          code: "<marquee lang={undefined} />",
          errors: [expectedError("marquee")],
        },
        { code: "<blink />", errors: [expectedError("blink")] },
        { code: "<blink {...props} />", errors: [expectedError("blink")] },
        { code: "<blink foo={undefined} />", errors: [expectedError("blink")] },
        {
          code: "<Blink />",
          settings: componentsSettings,
          errors: [expectedError("blink")],
        },
      ),
    )
    .map(parserOptionsMapper),
});
