import type getCategoryFlags from "./getCategoryFlags";
import type { Category, Condition } from "./types";

declare namespace getCategoryInfo {
  interface CategoryInfo {
    conditions: Condition[] | null;
    flags: getCategoryFlags.CategoryFlags;
  }
}

declare function getCategoryInfo(
  category: Category,
  moduleSystem?: "import" | "require",
): getCategoryInfo.CategoryInfo;

export = getCategoryInfo;
