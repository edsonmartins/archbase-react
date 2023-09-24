module.exports = {
  extends: ['react-app', 'react-app/jest', 'plugin:react/recommended', 'plugin:prettier/recommended', 'plugin:storybook/recommended'],
  plugins: ['react', 'prettier'],
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'newline-before-return': 'error',
    'import/no-anonymous-default-export': 0,
    'prettier/prettier': ['error', { 'endOfLine': 'auto' }],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
  },
};
