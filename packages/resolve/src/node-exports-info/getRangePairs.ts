import ranges from "./ranges";
import type { Category, Range } from "./types";

export default function getRangePairs(): [Range, Category][] {
  return Object.entries(ranges) as [Range, Category][];
}
