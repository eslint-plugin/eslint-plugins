import { satisfies } from "semver";

import ranges from "./ranges";
import type { Category } from "./types";

export default function getCategory(nodeVersion?: string): Category {
  const version = nodeVersion ?? process.version;
  const rangeEntries = Object.entries(ranges);
  for (let i = 0; i < rangeEntries.length; i += 1) {
    const entry = rangeEntries[i]!;
    if (satisfies(version, entry[0])) {
      return entry[1];
    }
  }

  throw new RangeError(`no category found for version ${version}`);
}
