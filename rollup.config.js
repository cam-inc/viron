import json from 'rollup-plugin-json';
import riot from 'rollup-plugin-riot';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import buble from 'rollup-plugin-buble';
import serve from 'rollup-plugin-serve';
import filesize from 'rollup-plugin-filesize';
import replace from 'rollup-plugin-replace';

// import uglify from 'rollup-plugin-uglify'
import eslint from 'rollup-plugin-eslint';

// @see https://github.com/rollup/rollup/wiki/JavaScript-API
export default {
  entry: 's/index.js',
  dest: 'dist/dmc.js',
  sourceMap: false,
  // exports: 'default',
  exports: 'none',
  format: 'iife',
  plugins: [
    json(),
    replace({
      'process.env.NODE_ENV': '"local"' // local/development/staging/production
    }),
    riot({
      template: 'pug'
    }),
    nodeResolve({
      jsnext: true
      // main: true,
      // browser: true
    }),
    commonjs({
      include: 'node_modules/**'
    }),
    buble({
      target: {
        // chrome: 49, firefox: 45, safari: 9, edge: 12, ie: 11
        chrome: 52
      }
    }),
    filesize(),
    // uglify(),
    eslint({ exclude: ['**/*.tag'] }),
    serve({
      contentBase: 'dist', // Folder to serve files from,
      historyApiFallback: false, // Set to true to return index.html instead of 404
      host: 'localhost', // Options used in setting up server
      port: 8080
    })
  ]
};
