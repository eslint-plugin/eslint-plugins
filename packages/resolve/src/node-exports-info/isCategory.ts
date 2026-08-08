import getRangePairs from "./getRangePairs";
import type { Category } from "./types";

export default function isCategory(category: unknown): category is Category {
  const all = getRangePairs();

  for (let i = 0; i < all.length; i++) {
    if (all[i]![1] === category) {
      return true;
    }
  }
  return false;
}
