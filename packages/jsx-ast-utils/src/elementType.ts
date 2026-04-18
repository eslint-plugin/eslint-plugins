import type { ESTreeJSX } from "./types";

function resolveMemberExpressions(
  object: ESTreeJSX.JSXIdentifier | ESTreeJSX.JSXMemberExpression,
  property: ESTreeJSX.JSXIdentifier,
): string {
  if (object.type === "JSXMemberExpression") {
    return `${resolveMemberExpressions(object.object, object.property)}.${property.name}`;
  }

  return `${object.name}.${property.name}`;
}

/**
 * Returns the tagName associated with a JSXElement.
 */
export default function elementType(
  node: ESTreeJSX.JSXOpeningElement | ESTreeJSX.JSXOpeningFragment,
): string {
  if (node.type === "JSXOpeningFragment") {
    return "<>";
  }

  const { name } = node;

  if (!name) {
    throw new Error("The argument provided is not a JSXElement node.");
  }

  if (name.type === "JSXMemberExpression") {
    const { object, property } = name;
    return resolveMemberExpressions(object, property);
  }

  if (name.type === "JSXNamespacedName") {
    return `${name.namespace.name}:${name.name.name}`;
  }

  return name.name;
}
