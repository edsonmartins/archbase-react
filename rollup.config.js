import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import url from '@rollup/plugin-url'
import svgr from '@svgr/rollup'
import del from 'rollup-plugin-delete'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2'
import ttypescript from 'ttypescript'
import pkg from './package.json'
export default [
  {
    input: 'src/index.tsx',
    output: [
      {
        format: 'cjs',
        dir: 'dist/cjs',
        preserveModules: true,
        preserveModulesRoot: 'src',
        exports: 'named',
        sourcemap: 'true',
      },
      {
        format: 'es',
        dir: 'dist/esm',
        preserveModules: true,
        preserveModulesRoot: 'src',
        exports: 'named',
        sourcemap: 'true',
      },
    ],
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {}), './src'],
    plugins: [
      peerDepsExternal(),
      postcss({
        plugins: [],
        minimize: true,
        extract: true,
      }),
      typescript({
        typescript: ttypescript,
        tsconfig: './tsconfig.build.json',
      }),
      nodeResolve(),
      commonjs(),
      babel({
        babelHelpers: 'runtime',
        exclude: 'node_modules/**',
        extensions: ['.ts', '.tsx'],
      }),
      json(),
      url(),
      svgr(),
      terser(),
      del({ targets: 'dist/*' }),
    ],
  },
]
