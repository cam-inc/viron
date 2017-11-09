import mout from 'mout';
import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import nodeResolve from 'rollup-plugin-node-resolve';
import progress from 'rollup-plugin-progress';
import replace from 'rollup-plugin-re';
import riot from 'rollup-plugin-riot';

const namedExports = {};
mout.object.forOwn(mout, (v, k) => {
  if (!mout.lang.isObject(v)) {
    return;
  }
  const key = `node_modules/mout/${k}.js`;
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
  input: 'src/app.js',
  output: {
    file: 'dist/js/app.js',
    sourcemap: false,
    exports: 'none',
    format: 'iife',
    strict: false
  },
  context: 'window',
  plugins: [
    builtins(),
    replace({
      patterns: [{
        test: /onTap="{.+?}"/g,
        replace: str => {
          const handlerName = str.replace('onTap="{', '').replace('}"', '').replace(/ /g, '');
          return `onClick="{ getClickHandler('${handlerName}') }" onTouchStart="{ getTouchStartHandler() }" onTouchMove="{ getTouchMoveHandler() }" onTouchEnd="{ getTouchEndHandler('${handlerName}') }"`;
        }
      }]
    }),
    json(),
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
        chrome: 52,
        edge: 13
      }
    }),
    progress()
  ]
};
