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
import alias from 'rollup-plugin-alias';
import json from "@rollup/plugin-json";


const config = {
  input: './src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: false,
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: false,
    },
  ],
  plugins: [
    alias({
      '@components': './src/components',
      '@hooks': './src/components/hooks',
      '@demo': './src/demo',
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
  ],
  context: 'null',
  watch: {
    clearScreen: false,
  },
};

export default config;
