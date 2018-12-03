import ObjectAssign from 'object-assign';
import server from 'rollup-plugin-server';
import baseConfig from './rollup.base.config.js';

const config = ObjectAssign({
  watch: {
    chokidar: true,
    include: 'src/**',
    exclude: 'src/css/**'
  }
}, baseConfig);

config.plugins.push(server({
  contentBase: 'dist', // Folder to serve files from,
  historyApiFallback: false, // Set to true to return index.html instead of 404
  host: 'localhost', // Options used in setting up server
  ssl: false,
  port: 8080
}));

export default config;
