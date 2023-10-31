import { readFileSync } from 'fs';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import url from '@rollup/plugin-url';
import svgr from '@svgr/rollup';
import { nodeExternals } from 'rollup-plugin-node-externals'
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';
import typescriptEngine from 'typescript';
import json from '@rollup/plugin-json';

const packageJson = JSON.parse(readFileSync('./package.json'));

export default [
  {
    input: './src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
        name: packageJson.name,
        inlineDynamicImports: true,
      },
      {
        file: packageJson.module,
        format: 'es',
        exports: 'named',
        sourcemap: true,
        inlineDynamicImports: true,
      },
    ],
    plugins: [
      nodeExternals({exclude:'@emotion/react'}),
      postcss({
        plugins: [],
        minimize: true,
        extract: true,
      }),
      resolve({ preferBuiltins: false, mainFields: ['browser'] }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        typescript: typescriptEngine,
        sourceMap: false,
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
          '**/*.story.ts+(|x)',
          '**/*.story.js+(|x)',
          '**/*.stories.ts+(|x)',
          '**/*.stories.js+(|x)',
        ],
      }),
      json(),
      url(),
      svgr(),
      terser(),
    ],
  },
  {
    input: 'dist/esm/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    external: [/\.(sc|sa|c)ss$/],
    plugins: [dts()],
  },
];
