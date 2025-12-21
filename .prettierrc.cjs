/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */
module.exports = {
  singleQuote: true,
  bracketSameLine: true,
  tabWidth: 2,
  printWidth: 120,
  trailingComma: 'all',
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  importOrderCaseSensitive: true,
  importOrder: [
    '<TYPES>^(node:)',
    '<TYPES>',
    '<TYPES>^[.]',
    '',
    '^react$', // react first
    '',
    '<BUILTIN_MODULES>',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/.*$', // internal absolute imports
    '^../.*$', // relative parent imports
    '^./.*$', // relative sibling imports
  ],
};
