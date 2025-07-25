module.exports = {
  root: true,
  extends: '@react-native',

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
        'no-dupe-keys': 'off',
        'no-undef': 'off',
        'no-catch-shadow': 'off',
      },
    },
  ],
};
