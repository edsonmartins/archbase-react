module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/jsx-runtime',
    'plugin:storybook/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: ['react', 'react-hooks', 'react-refresh', 'storybook', 'import', 'jsx-a11y', 'prettier'],
  env: {
    node: true,
    browser: true,
  },
  settings: {
    ecmaVersion: 'latest',
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: true,
      typescript: true,
    },
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  ignorePatterns: [
    '!*.js',
    '!.storybook',
    '.*.js',
    '*.json',
    'scripts',
    'src/graphql/generated/*',
  ],
  rules: {
    'react-refresh/only-export-components': 'warn',
    'newline-before-return': 'error',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-warning-comments': 'warn',
    'object-shorthand': 'error',
    'no-param-reassign': 'off',
    'react/prop-types': 'off',
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: true,
      },
    ],
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-curly-brace-presence': [
      'error',
      { props: 'never', children: 'never' },
    ],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link', 'NextLink', 'RouterLink'],
        aspects: ['invalidHref'],
      },
    ],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        pathGroups: [
          {
            pattern: '$/**',
            group: 'internal',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        groups: [
          ['builtin', 'external'],
          ['internal'],
          ['parent', 'sibling', 'index'],
          'unknown',
        ],
      },
    ],
  },
  ignorePatterns: ['.eslintrc.cjs', 'vitest.config.ts', 'setupTests.ts'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/typescript',
      ],
      plugins: ['@typescript-eslint/eslint-plugin'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/no-angle-bracket-type-assertion': 'off',
        '@typescript-eslint/no-parameter-properties': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/member-delimiter-style': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/member-ordering': 'error',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/member-ordering':'off',
        '@typescript-eslint/ban-ts-comment':'off',
        'no-prototype-builtins':'off',
        'import/order':'off',
        '@typescript-eslint/no-use-before-define':'warning',
        'jsx-a11y/no-static-element-interactions':'off',
        '@typescript-eslint/no-base-to-string':'off',
        '@typescript-eslint/no-use-before-define':'off',
        '@typescript-eslint/no-redundant-type-constituents':'off',
        '@typescript-eslint/no-use-before-define':'off',
        'jsx-a11y/click-events-have-key-events':'off',
        'no-irregular-whitespace':'off',
        '@typescript-eslint/no-misused-promises':'off',
        '@typescript-eslint/unbound-method':'off',
        'react/jsx-key':'off',
        'react/display-name':'off',
        'jsx-a11y/no-autofocus':'off',
        '@typescript-eslint/no-floating-promises': [
          'error',
          { ignoreVoid: true },
        ],
        'prettier/prettier': [
          'error', 
          { 'endOfLine': 'auto' },
        ],
      },
    },
    {
      files: [
        '*story.*',
        '*stories.*',
        'src/pages/**/*.tsx',
        'additional.d.ts',
        '**/__mocks__/**',
      ],
      rules: {
        'import/no-anonymous-default-export': 'off',
        'import/no-default-export': 'off',
        '@typescript-eslint/no-unused-vars':'off'
      },
    },
  ],
};
