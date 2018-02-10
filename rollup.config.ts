import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify';
import {minify} from 'uglify-es';

const pkg = require('./package.json')

export default [
  // build vmap parser
  {
    input: `compiled/index.js`,
    output: [
      {file: pkg.module, format: 'umd'},
    ],
    sourcemap: true,
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: [],
    watch: {
      include: 'compiled/**',
    },
    plugins: [
      // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
      commonjs(),
      // Allow node_modules resolution, so you can use 'external' to control
      // which external modules to include in the bundle
      // https://github.com/rollup/rollup-plugin-node-resolve#usage
      resolve(),
      uglify({}, minify)
    ],
  },

  // build JwPlayer Plugin
  {
    input: `compiled/jwplayer-plugin/index.js`,
    output: [
      {file: `dist/jwplayer/vmap.js`, format: 'umd'},
    ],
    sourcemap: true,
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: [],
    watch: {
      include: 'compiled/jwplayer-plugin/**',
    },
    plugins: [
      // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
      commonjs(),
      // Allow node_modules resolution, so you can use 'external' to control
      // which external modules to include in the bundle
      // https://github.com/rollup/rollup-plugin-node-resolve#usage
      resolve(),
      uglify({}, minify)
    ],
  },

  // build VideoJs Plugin
  {
    input: `compiled/videojs-plugin/index.js`,
    output: [
      {file: `dist/videojs/vmap.js`, format: 'umd'},
    ],
    sourcemap: true,
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: [],
    watch: {
      include: 'compiled/videojs-plugin/**',
    },
    plugins: [
      // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
      commonjs(),
      // Allow node_modules resolution, so you can use 'external' to control
      // which external modules to include in the bundle
      // https://github.com/rollup/rollup-plugin-node-resolve#usage
      resolve(),
      uglify({}, minify)
    ],
  }
]
