import getCategoryFlags, { type CategoryFlags } from "./getCategoryFlags";
import getConditionsForCategory from "./getConditionsForCategory";
import type { Category, Condition } from "./types";

export default function getCategoryInfo(
  category: Category,
  moduleSystem?: "import" | "require",
): CategoryInfo {
  const conditions = getConditionsForCategory(
    category,
    moduleSystem || "require",
  );
  const flags = getCategoryFlags(category);
  return { conditions, flags };
}

export interface CategoryInfo {
  conditions: readonly Condition[] | null;
  flags: CategoryFlags;
}
