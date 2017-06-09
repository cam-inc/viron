import json from 'rollup-plugin-json';
import riot from 'rollup-plugin-riot';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import buble from 'rollup-plugin-buble';
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

// @see https://github.com/rollup/rollup/wiki/JavaScript-API
export default {
  entry: 'src/app.js',
  dest: 'dist/js/app.js',
  sourceMap: false,
  exports: 'none',
  format: 'iife',
  useStrict: false,
  context: 'window',
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
    })
  ]
};
