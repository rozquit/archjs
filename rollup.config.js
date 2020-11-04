import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

const mode = process.env.NODE_ENV
const dev = mode === 'development'
const src = 'src'
const dest = 'dist'
const stc = 'static'
const sourcemap = dev ? 'inline' : false

function serve () {
  let server
  function toExit () {
    if (server) server.kill(0)
  }
  return {
    writeBundle () {
      if (server) return
      server = require('child_process').spawn('nodemon', {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      })
      process.on('SIGTERM', toExit)
      process.on('exit', toExit)
    }
  }
}

export default [
  {
    input: `${src}/client.js`,
    output: {
      file: `${stc}/build/app.js`,
      format: 'iife',
      sourcemap
    },
    plugins: [
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode)
      }),
      svelte({
        dev,
        hydratable: true,
        css: css => {
          css.write('app.css')
        }
      }),
      resolve({
        browser: true,
        dedupe: ['svelte']
      }),
      json(),
      commonjs(),
      babel({
        extensions: ['.js', '.mjs', '.html', '.svelte'],
        babelHelpers: 'runtime',
        exclude: ['node_modules/@babel/**'],
        presets: [
          ['@babel/preset-env', {
            targets: '> 0.25%, not dead'
          }]
        ],
        plugins: [
          '@babel/plugin-syntax-dynamic-import',
          ['@babel/plugin-transform-runtime', {
            useESModules: true
          }]
        ]
      }),
      dev && serve(),
      dev && livereload(stc),
      !dev && terser({
        module: true
      })
    ],
    watch: {
      clearScreen: false
    },

    preserveEntrySignatures: false
  },
  {
    input: `${src}/server.js`,
    output: {
      file: `${dest}/server.js`,
      format: 'cjs',
      sourcemap
    },
    plugins: [
      replace({
        'process.browser': false,
        'process.env.NODE_ENV': JSON.stringify(mode)
      }),
      svelte({
        generate: 'ssr',
        hydratable: true,
        dev
      }),
      resolve({
        dedupe: ['svelte']
      }),
      commonjs()
    ],
    external: Object.keys(pkg.dependencies).concat(require('module').builtinModules),

    preserveEntrySignatures: 'strict'
  },
  {
    input: `${src}/sw.js`,
    output: {
      file: `${stc}/build/sw.js`,
      format: 'iife',
      sourcemap
    },
    plugins: [
      resolve(),
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode)
      }),
      commonjs(),
      !dev && terser()
    ],

    preserveEntrySignatures: false
  }
]
