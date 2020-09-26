import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json'

const config = [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: pkg.name
    },
    external: [
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [
      nodeResolve(),
      commonjs({
        include: 'node_modules/**'
      }),
      babel({
        exclude: 'node_modules/**'
      }),
      terser()
    ]
  }
];

export default config;