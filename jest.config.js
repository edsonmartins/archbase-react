module.exports = {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx,js,jsx}'],
  modulePaths: ['<rootDir>/src'],
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    '@components/(.*)': '<rootDir>/src/components/$1',
    '@hooks/(.*)': '<rootDir>/src/components/hooks/$1',
    // Mock problematic ES modules
    '^query-string$': '<rootDir>/src/__mocks__/query-string.js',
    // Mock other problematic dependencies for tests
    '^../querybuilder/ArchbaseFilterDSL$': '<rootDir>/src/__mocks__/ArchbaseFilterDSL.js',
    // Mock specific CSS files that cause issues
    './ArchbaseFloatingWindow.css': '<rootDir>/src/__mocks__/ArchbaseFloatingWindow.css.js',
    // Mock CSS and other static files
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  modulePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.[jt]s?(x)', '<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }],
    '^.+\\.js$': 'babel-jest',
    '\\.(jpg|jpeg|png|eot|otf|webp|svg|ttf|woff|woff2|webm)$': 'jest-transform-stub',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@tanstack|query-string|decode-uri-component|split-on-first|filter-obj)/)'
  ]
}
