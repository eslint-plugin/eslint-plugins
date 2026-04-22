# ESLint Plugins

This repository contains several ESLint plugins.

## Plugins

### [`@eslintplugin/eslint-plugin-jsx-a11y`](./packages/eslint-plugin-jsx-a11y) plugin

A fork of the [`eslint-plugin-jsx-a11y`](https://npmx.dev/eslint-plugin-jsx-a11y) plugin. Docs for each rule can be found in the [`eslint-plugin-jsx-a11y` repo](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/main/docs/rules)

### [`@eslintplugin/eslint-plugin-react`](./packages/eslint-plugin-react) plugin

A fork of the [`eslint-plugin-react`](https://npmx.dev/eslint-plugin-react) plugin. Docs for each rule can be found in the [`eslint-plugin-react` repo](https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules)

## Migrating

The simplest way to migrate is to use [package aliases](https://docs.npmjs.com/cli/v11/using-npm/package-spec#aliases), for example:

```json
"eslint-plugin-jsx-a11y": "npm:@eslintplugin/eslint-plugin-jsx-a11y@0.0.3"
```
