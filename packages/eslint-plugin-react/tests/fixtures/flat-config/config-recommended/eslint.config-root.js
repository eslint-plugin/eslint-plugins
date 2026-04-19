'use strict';

const reactPlugin = require('../../../../src/index');

module.exports = [{
  files: ['**/*.jsx'],
  ...reactPlugin.configs.flat.recommended
}];
