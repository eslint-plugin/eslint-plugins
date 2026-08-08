export default {
  ">= 25.4": "subpath-imports-slash", // added in 25.4
  "23.6 - 25.3 || ^22.18": "strips-types", // added in 23.6, backported to 22.18
  "23 - 23.5 || 22.12 - 22.17 || ^20.19": "require-esm", // added in 23.0, 22.12, 20.19
  "17.1 - 19 || 20 - 20.18 || ^21 || 22 - 22.11":
    "pattern-trailers-no-dir-slash+json-imports",
} as const;
