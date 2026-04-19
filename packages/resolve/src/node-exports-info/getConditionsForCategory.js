import isCategory from "./isCategory";

// pre-computed condition sets
/** @type {['import', 'node', 'require', 'default']} */
const base = ["import", "node", "require", "default"];
/** @type {['import', 'node', 'default']} */
const baseImport = ["import", "node", "default"];
/** @type {['node', 'require', 'default']} */
const baseRequire = ["node", "require", "default"];
/** @type {['import', 'node-addons', 'node', 'require', 'default']} */
const withAddons = ["import", "node-addons", "node", "require", "default"];
/** @type {['import', 'node-addons', 'node', 'default']} */
const withAddonsImport = ["import", "node-addons", "node", "default"];
/** @type {['node-addons', 'node', 'require', 'default']} */
const withAddonsRequire = ["node-addons", "node", "require", "default"];
/** @type {['import', 'node-addons', 'node', 'require', 'module-sync', 'default']} */
const withAddonsModuleSync = [
  "import",
  "node-addons",
  "node",
  "require",
  "module-sync",
  "default",
];
/** @type {['import', 'node-addons', 'node', 'module-sync', 'default']} */
const withAddonsModuleSyncImport = [
  "import",
  "node-addons",
  "node",
  "module-sync",
  "default",
];
/** @type {['node-addons', 'node', 'require', 'module-sync', 'default']} */
const withAddonsModuleSyncRequire = [
  "node-addons",
  "node",
  "require",
  "module-sync",
  "default",
];

// categories that support node-addons condition (added in v14.19/v16.10)
/** @type {{ [k: string]: boolean | null | undefined }} */
const nodeAddonsCategories = {
  __proto__: null,
  "pattern-trailers": true,
  "pattern-trailers+json-imports": true,
  "pattern-trailers-no-dir-slash": true,
  "pattern-trailers-no-dir-slash+json-imports": true,
  "require-esm": true,
  "strips-types": true,
  "subpath-imports-slash": true,
};

// categories that support module-sync condition (added in v22.12)
/** @type {{ [k: string]: boolean | null | undefined }} */
const moduleSyncCategories = {
  __proto__: null,
  "require-esm": true,
  "strips-types": true,
  "subpath-imports-slash": true,
};

/** @type {import('./getConditionsForCategory')} */
export default function getConditionsForCategory(category) {
  if (!isCategory(category)) {
    throw new RangeError("invalid category " + category);
  }

  const moduleSystem = arguments.length > 1 ? arguments[1] : null;
  if (
    arguments.length > 1 &&
    moduleSystem !== "import" &&
    moduleSystem !== "require"
  ) {
    throw new TypeError(
      "invalid moduleSystem: must be `'require'` or `'import'` if provided, got" +
        moduleSystem,
    );
  }

  if (category === "experimental") {
    return ["default"];
  }
  if (category === "broken" || category === "pre-exports") {
    return null;
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
