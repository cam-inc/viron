import json from 'rollup-plugin-json';
import riot from 'rollup-plugin-riot';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import buble from 'rollup-plugin-buble';
import serve from 'rollup-plugin-serve';
import filesize from 'rollup-plugin-filesize';
import replace from 'rollup-plugin-replace';

const mout = require('mout');

let namedExports = {};
mout.object.forOwn(mout, (v,k) => {

  if(!mout.lang.isObject(v)) {
    return;
  }

  let key = 'node_modules/mout/' + k + '.js';
  if (!namedExports[key]) {
    namedExports[key] = [];
  }

  mout.object.forOwn(v, (v1, k1) => {
    if (mout.lang.isFunction(v1)) {
      namedExports[key].push(k1);
    }
  });
});

// TODO: 開発時とリリース時でconfigを変更すること。

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
  useStrict: false,
  moduleContext: { 'node_modules/whatwg-fetch/fetch.js': 'window' },
  // external: null,
  // globals: { },
  plugins: [
    json(),
    replace({
      'process.env.NODE_ENV': '"local"' // local/development/staging/production
    }),
    riot({
      template: 'pug'
    }),
    nodeResolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs({
      include: 'node_modules/**',
      namedExports: namedExports
    }),
    buble({
      target: {
        //chrome: 49, firefox: 45, safari: 9, edge: 12, ie: 11
        chrome: 52
      }
    }),
    filesize(),
    // uglify(),
    eslint({exclude: ['**/*.tag']}),
    serve({
      contentBase: 'dist', // Folder to serve files from,
      historyApiFallback: false, // Set to true to return index.html instead of 404
      host: 'localhost', // Options used in setting up server
      port: 8080
    })
  ]
};
