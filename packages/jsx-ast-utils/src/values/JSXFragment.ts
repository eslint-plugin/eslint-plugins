import getValue from "./index";

/**
 * Extractor function for a JSXFragment type value node.
 *
 * Returns self-closing element with correct name.
 */
export default function extractValueFromJSXFragment(value) {
  if (value.children.length === 0) {
    return "<></>";
  }
  return `<>${[]
    .concat(value.children)
    .map((x) => getValue(x))
    .join("")}</>`;
}
