/* eslint-env node */
const path = require('path');
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    project: path.resolve(__dirname, 'tsconfig.json'),
    tsconfigRoot: __dirname,
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  rules: {}
};
