

/* eslint-disable */
module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  ignorePatterns: ['i18n'],
  globals: {
    page: true,
  },

  rules: {
    // your rules
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'no-unused-vars': 'off', //  eslint 原始功能关闭，
    '@typescript-eslint/no-unused-vars': 'warn', //  使用typescript提供的功能
    '@typescript-eslint/no-unused-expressions': 'warn',
    '@typescript-eslint/array-type': 'off',
  },
};
