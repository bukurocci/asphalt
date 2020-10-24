import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import eslint from '@rbnlffl/rollup-plugin-eslint';
import pkg from './package.json';

const banner = `
/*!
 * Asphalt.js
 * Copyright (c) ${new Date().getFullYear()} ${pkg.author}
 *
 * Released under the MIT license
 */
`;

const config = [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      banner
    },
    external: [...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      eslint({
        fix: true
      }),
      nodeResolve(),
      commonjs({
        include: 'node_modules/**'
      }),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**'
      }),
      terser()
    ]
  }
];

export default config;
