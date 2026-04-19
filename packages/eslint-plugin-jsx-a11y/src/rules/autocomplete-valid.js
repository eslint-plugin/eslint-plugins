/**
 * @fileoverview Ensure autocomplete attribute is correct.
 * @author Wilco Fiers
 */

import { getLiteralPropValue, getProp } from "@eslintplugin/jsx-ast-utils";
// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import getElementType from "../util/getElementType";
import isValidAutocomplete from "../util/is-valid-autocomplete";
import { generateObjSchema, arraySchema } from "../util/schemas";

const schema = generateObjSchema({
  inputComponents: arraySchema,
});

export default {
  meta: {
    docs: {
      url: "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/autocomplete-valid.md",
      description: "Enforce that autocomplete attributes are used correctly.",
    },
    schema: [schema],
  },

  create: (context) => {
    const elementType = getElementType(context);
    return {
      JSXOpeningElement: (node) => {
        const options = context.options[0] || {};
        const { inputComponents = [] } = options;
        const inputTypes = ["input"].concat(inputComponents);

        const elType = elementType(node);
        const autocomplete = getLiteralPropValue(
          getProp(node.attributes, "autocomplete"),
        );

        if (typeof autocomplete !== "string" || !inputTypes.includes(elType)) {
          return;
        }

        if (autocomplete === "none") {
          return;
        }

        const type = getLiteralPropValue(getProp(node.attributes, "type"));
        const isValid = isValidAutocomplete(autocomplete, {
          type: type === null ? undefined : type,
        });

        if (isValid) {
          return;
        }

        // Since we only test one rule, with one node, return the message from first (and only) instance of each
        context.report({
          node,
          message: "the autocomplete attribute is incorrectly formatted",
        });
      },
    };
  },
};
