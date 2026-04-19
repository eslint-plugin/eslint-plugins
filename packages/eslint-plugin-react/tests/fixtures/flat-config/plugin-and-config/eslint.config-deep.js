'use strict';

const react = require('../../../../src/index');
const reactRecommended = require('../../../../configs/recommended');

module.exports = [
  {
    files: ['**/*.jsx'],
    plugins: { react }
  },
  {
    files: ['**/*.jsx'],
    ...reactRecommended,
    languageOptions: {
      ...reactRecommended.languageOptions
    }
  }
];
