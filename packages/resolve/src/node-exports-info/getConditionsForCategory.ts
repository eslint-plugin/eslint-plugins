import isCategory from "./isCategory";
import type { Category } from "./types";

// pre-computed condition sets
const base = ["import", "node", "require", "default"] as const;

const baseImport = ["import", "node", "default"] as const;

const baseRequire = ["node", "require", "default"] as const;

const withAddons = [
  "import",
  "node-addons",
  "node",
  "require",
  "default",
] as const;

const withAddonsImport = ["import", "node-addons", "node", "default"] as const;

const withAddonsRequire = [
  "node-addons",
  "node",
  "require",
  "default",
] as const;

const withAddonsModuleSync = [
  "import",
  "node-addons",
  "node",
  "require",
  "module-sync",
  "default",
] as const;

const withAddonsModuleSyncImport = [
  "import",
  "node-addons",
  "node",
  "module-sync",
  "default",
] as const;

const withAddonsModuleSyncRequire = [
  "node-addons",
  "node",
  "require",
  "module-sync",
  "default",
] as const;

// categories that support node-addons condition (added in v14.19/v16.10)
const nodeAddonsCategories: Record<string, boolean | null | undefined> = {
  __proto__: null,
  "pattern-trailers-no-dir-slash+json-imports": true,
  "require-esm": true,
  "strips-types": true,
  "subpath-imports-slash": true,
};

// categories that support module-sync condition (added in v22.12)
const moduleSyncCategories: Record<string, boolean | null | undefined> = {
  __proto__: null,
  "require-esm": true,
  "strips-types": true,
  "subpath-imports-slash": true,
};

export default function getConditionsForCategory(
  category: Category,
  moduleSystem?: "import" | "require",
): Readonly<
  | ["default"]
  | ["import", "node", "default"]
  | ["node", "require", "default"]
  | ["import", "node", "require", "default"]
  | ["import", "node-addons", "node", "default"]
  | ["node-addons", "node", "require", "default"]
  | ["import", "node-addons", "node", "require", "default"]
  | ["import", "node-addons", "node", "module-sync", "default"]
  | ["node-addons", "node", "require", "module-sync", "default"]
  | ["import", "node-addons", "node", "require", "module-sync", "default"]
  | null
> {
  if (!isCategory(category)) {
    throw new RangeError(`invalid category ${category}`);
  }

  const hasAddons = !!nodeAddonsCategories[category];
  const hasModuleSync = !!moduleSyncCategories[category];

  if (hasAddons && hasModuleSync) {
    return moduleSystem === "import"
      ? withAddonsModuleSyncImport
      : moduleSystem === "require"
        ? withAddonsModuleSyncRequire
        : withAddonsModuleSync;
  }
  if (hasAddons) {
    return moduleSystem === "import"
      ? withAddonsImport
      : moduleSystem === "require"
        ? withAddonsRequire
        : withAddons;
  }
  return moduleSystem === "import"
    ? baseImport
    : moduleSystem === "require"
      ? baseRequire
      : base;
}
