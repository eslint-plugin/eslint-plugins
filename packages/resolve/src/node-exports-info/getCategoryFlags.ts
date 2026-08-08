import isCategory from "./isCategory";
import type { Category } from "./types";

// Categories that support patterns (wildcard *)
const patternsCategories: Record<string, boolean | null | undefined> = {
  __proto__: null,
  "pattern-trailers-no-dir-slash+json-imports": true,
  "require-esm": true,
  "strips-types": true,
  "subpath-imports-slash": true,
};

// Categories that support pattern trailers (suffix after *)
const patternTrailersCategories: Record<string, boolean | null | undefined> = {
  __proto__: null,
  "pattern-trailers-no-dir-slash+json-imports": true,
  "require-esm": true,
  "strips-types": true,
  "subpath-imports-slash": true,
};

// Categories that support directory slash exports (ending with /)
const dirSlashCategories: Record<string, boolean | null | undefined> = {
  __proto__: null,
  "subpath-imports-slash": true,
};

export default function getCategoryFlags(category: Category): CategoryFlags {
  if (!isCategory(category)) {
    throw new RangeError(`invalid category ${category}`);
  }

  return {
    patterns: !!patternsCategories[category],
    patternTrailers: !!patternTrailersCategories[category],
    dirSlash: !!dirSlashCategories[category],
  };
}

export interface CategoryFlags {
  patterns: boolean;
  patternTrailers: boolean;
  dirSlash: boolean;
}
