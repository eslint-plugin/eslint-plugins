import JSXExpressionContainer, { extractLiteral } from "./expressions";
import JSXElement from "./JSXElement";
import JSXFragment from "./JSXFragment";
import JSXText from "./JSXText";
import Literal from "./Literal";

// Composition map of types to their extractor functions.
const TYPES = {
  Literal,
  JSXElement,
  JSXExpressionContainer,
  JSXText,
  JSXFragment,
} as const;

// Composition map of types to their extractor functions to handle literals.
const LITERAL_TYPES = {
  ...TYPES,
  JSXElement: () => null,
  JSXExpressionContainer: extractLiteral,
};

/**
 * This function maps an AST value node
 * to its correct extractor function for its
 * given type.
 *
 * This will map correctly for *all* possible types.
 *
 * @param value - AST Value object on a JSX Attribute.
 */
export default function getValue(value) {
  if (!TYPES[value.type]) console.log(value.type);
  return TYPES[value.type](value);
}

/**
 * This function maps an AST value node
 * to its correct extractor function for its
 * given type.
 *
 * This will map correctly for *some* possible types that map to literals.
 *
 * @param value - AST Value object on a JSX Attribute.
 */
export function getLiteralValue(value) {
  return LITERAL_TYPES[value.type](value);
}
