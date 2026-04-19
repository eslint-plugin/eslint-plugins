import { intersects } from "semver";

import ranges from "./ranges";

/** @type {import('./getCategoriesForRange')} */
export default function getCategoriesForRange(rangeA) {
  return Object.entries(ranges).flatMap(
    /** @type {(entry: import('./types').RangePair) => import('./types').Category[] | []} */
    function (entry) {
      const rangeB = entry[0];
      const category = entry[1];
      return intersects(rangeA, rangeB) ? [category] : [];
    },
  );
}
