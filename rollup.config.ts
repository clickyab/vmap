import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify';
import {minify} from 'uglify-es';

const pkg = require('./package.json')

export default [
    // build package
    {
        input: `compiled/index.js`,
        output: [
            {file: pkg.module, format: 'es'},
            {file: "./dist/inedx.js", format: 'umd', name: "sd"},
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
    // build vmap parser
    {
        input: `compiled/parser/index.js`,
        output: [
            {file: "./dist/parser/inedx.js", format: 'es'},
            {file: "./dist/parser/browser.js", format: 'umd', name: "parser"},
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
            {file: `dist/jwplayer/vast.js`, format: 'umd', name: "jwplayer-plugin"},
            {file: `dist/jwplayer/index.js`, format: 'es'},
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
            {file: `dist/videojs/vast.js`, format: 'umd', name: "videoJs-plugin"},
            {file: `dist/videojs/index.js`, format: 'es'},
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
