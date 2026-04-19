import getCategoryFlags from "./getCategoryFlags";
import getConditionsForCategory from "./getConditionsForCategory";

/** @type {import('./getCategoryInfo')} */
export default function getCategoryInfo(category, moduleSystem) {
  const conditions = getConditionsForCategory(
    category,
    moduleSystem || "require",
  );
  const flags = getCategoryFlags(category);
  return { conditions, flags };
}
