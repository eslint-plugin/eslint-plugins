"use strict";

const react = require("../../../../src/index");

module.exports = [
  {
    files: ["**/*.jsx"],
    plugins: { react },
  },
  {
    files: ["**/*.jsx"],
    ...react.configs.flat.recommended,
  },
];
