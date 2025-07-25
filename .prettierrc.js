module.exports = {
  arrowParens: 'avoid',
  singleQuote: true,
  trailingComma: 'all',
  overrides: [
    {
      files: ['*.tsx', '*.js'],
      rules: {
        'prettier/prettier': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'react-hooks/exhaustive-deps': 'off',
        '@typescript-eslint/no-shadow': 'off',
        'react-native/no-inline-styles': 'off',
        'react-hooks/rules-of-hooks': 'off',
        'react/no-unstable-nested-components': 'off',
        'react/self-closing-comp': 'off',
        'no-sequences': 'off',
        'eslint-disable-next-line no-dupe-keys': 'off',
        'eslint-disable-next-line no-undef': 'off',
        'eslint-disable-next-line no-catch-shadow': 'off',
        'eslint-disable no-undef': 'off',
      },
    },
  ],
};
