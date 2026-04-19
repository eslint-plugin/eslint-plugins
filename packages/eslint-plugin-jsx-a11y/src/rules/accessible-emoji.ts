/**
 * @fileoverview Enforce emojis are wrapped in <span> and provide screen reader access.
 * @author Ethan Cohen
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import { getProp, getLiteralPropValue } from "@eslintplugin/jsx-ast-utils";
import emojiRegex from "emoji-regex-xs";

import getElementType from "../util/getElementType";
import isHiddenFromScreenReader from "../util/isHiddenFromScreenReader";
import { generateObjSchema } from "../util/schemas";

const errorMessage =
  'Emojis should be wrapped in <span>, have role="img", and have an accessible description with aria-label or aria-labelledby.';

const schema = generateObjSchema();
const emojiExpression = emojiRegex();

export default {
  meta: {
    docs: {
      description:
        "Enforce emojis are wrapped in `<span>` and provide screen reader access.",
      url: "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/accessible-emoji.md",
    },
    deprecated: true,
    schema: [schema],
  },

  create: (context) => {
    const elementType = getElementType(context);

    const testEmoji = (value: unknown): boolean => {
      if (typeof value !== "string") return false;
      emojiExpression.lastIndex = 0;
      return emojiExpression.test(value);
    };

    return {
      JSXOpeningElement: (node) => {
        const literalChildValue = node.parent.children.find(
          (child) => child.type === "Literal" || child.type === "JSXText",
        );

        if (literalChildValue && testEmoji(literalChildValue.value)) {
          const elementIsHidden = isHiddenFromScreenReader(
            elementType(node),
            node.attributes,
          );
          if (elementIsHidden) {
            return; // emoji is decorative
          }

          const rolePropValue = getLiteralPropValue(
            getProp(node.attributes, "role"),
          );
          const ariaLabelProp = getProp(node.attributes, "aria-label");
          const arialLabelledByProp = getProp(
            node.attributes,
            "aria-labelledby",
          );
          const hasLabel =
            ariaLabelProp !== undefined || arialLabelledByProp !== undefined;
          const isSpan = elementType(node) === "span";

          if (
            hasLabel === false ||
            rolePropValue !== "img" ||
            isSpan === false
          ) {
            context.report({
              node,
              message: errorMessage,
            });
          }
        }
      },
    };
  },
};
