import getValue from "./index";

/**
 * Extractor function for an ObjectExpression type value node.
 * An object expression is using {}.
 *
 * @returns - a representation of the object
 */
export default function extractValueFromObjectExpression(value) {
  return value.properties.reduce((obj, property) => {
    // Support types: SpreadProperty and ExperimentalSpreadProperty
    if (/^(?:Experimental)?Spread(?:Property|Element)$/.test(property.type)) {
      if (property.argument.type === "ObjectExpression") {
        return Object.assign(
          {},
          obj,
          extractValueFromObjectExpression(property.argument),
        );
      }
    } else {
      return Object.assign({}, obj, {
        [getValue(property.key)]: getValue(property.value),
      });
    }
    return obj;
  }, {});
}
