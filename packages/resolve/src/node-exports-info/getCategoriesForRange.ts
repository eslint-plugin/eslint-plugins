import { intersects } from "semver";

import ranges from "./ranges";
import type { Category } from "./types";

export default function getCategoriesForRange(rangeA: string): Category[] {
  return Object.entries(ranges).flatMap(function (entry) {
    const rangeB = entry[0];
    const category = entry[1];
    return intersects(rangeA, rangeB) ? [category] : [];
  });
}
