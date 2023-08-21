import { DEFAULT_EXTENSIONS } from '@babel/core';
import babel from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import url from '@rollup/plugin-url';
import svgr from '@svgr/rollup';
import { terser } from 'rollup-plugin-terser';
import typescriptEngine from 'typescript';
import pkg from './package.json' assert { type: 'json' };
import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import path from 'path';
import { fileURLToPath } from 'url';
import { dts } from 'rollup-plugin-dts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  input: './src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [
    alias({
      entries: [
        { find: '@components', replacement: path.resolve(__dirname, './src/components') },
        { find: '@hooks', replacement: path.resolve(__dirname, './src/components/hooks') },
        { find: '@demo', replacement: path.resolve(__dirname, './src/demo') },
      ],
    }),
    postcss({
      plugins: [],
      minimize: true,
      extract: true,
    }),
    external({
      includeDependencies: true,
    }),
    typescript({
      tsconfig: './tsconfig.json',
      typescript: typescriptEngine,
      include: ['*.js+(|x)', '**/*.js+(|x)', '*.ts+(|x)', '**/*.ts+(|x)'],
      exclude: [
        'coverage',
        '.storybook',
        'storybook-static',
        'config',
        'dist',
        'src/demo',
        'node_modules/**',
        '*.cjs',
        '*.mjs',
        '**/__snapshots__/*',
        '**/__tests__',
        '**/*.test.js+(|x)',
        '**/*.test.ts+(|x)',
        '**/*.mdx',
        '**/*.story.jsx',
        '**/*.story.tsx',
        '**/*.stories.ts+(|x)',
      ],
    }),
    generatePackageJson(),
    json(),
    babel({
      extensions: [...DEFAULT_EXTENSIONS, '.ts', 'tsx'],
      babelHelpers: 'runtime',
      exclude: /node_modules/,
    }),
    url(),
    svgr(),
    resolve({ preferBuiltins: true, mainFields: ['browser'] }),
    commonjs(),
    terser(),
    dts(),
  ],
  context: 'null',
  watch: {
    clearScreen: false,
  },
};

export default config;
