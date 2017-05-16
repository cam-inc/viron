import ObjectAssign from 'object-assign';
import serve from 'rollup-plugin-serve';
import baseConfig from './rollup.base.config.js';

const config = ObjectAssign({}, baseConfig);

config.plugins.push(serve({
  contentBase: 'dist', // Folder to serve files from,
  historyApiFallback: false, // Set to true to return index.html instead of 404
  host: 'localhost', // Options used in setting up server
  port: 8080
}));

export default config;
