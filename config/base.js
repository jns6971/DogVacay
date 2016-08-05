import _debug from 'debug';
import path from 'path';
import { argv } from 'yargs';
const debug = _debug('app:config:_base');

const config = {
  env: process.env.NODE_ENV || 'development',

  // ----------------------------------
  // Project Structure
  // ----------------------------------
  path_base: path.resolve(__dirname, '../'),
  dir_src: 'src',
  dir_dist: 'dist',
  dir_test: '__tests__',
  dir_example: 'example',
  dir_node_modules: 'node_modules',
  dir_lib: 'lib',

  // ----------------------------------
  // Application starting point
  // ----------------------------------
  client_app: 'index.js',
  client_test_file: 'index.html',
  example_file: 'index.html',
  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  server_host: 'localhost',
  server_port: process.env.PORT || 3000,

  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  compiler_css_modules: true,
  compiler_dev_devtool: 'inline-source-map',
  compiler_production_devtool: 'source-map',
  compiler_hash_type: 'hash',
  compiler_fail_on_warning: false,
  compiler_quiet: false,
  compiler_public_path: '',
  compiler_stats: {
    chunks: false,
    chunkModules: false,
    colors: true,
  },
  compiler_vendor: [
    'react',
  ],

};

// ------------------------------------
// Environment
// ------------------------------------
// N.B.: globals added here must _also_ be added to .eslintrc
config.globals = {
  'process.env': {
    NODE_ENV: JSON.stringify(config.env),
  },
  NODE_ENV: config.env,
  __DEV__: config.env === 'development',
  __PROD__: config.env === 'production',
  __TEST__: config.env === 'test',
  __DEBUG__: config.env === 'development' && !argv.no_debug,
  __DEBUG_NEW_WINDOW__: !!argv.nw,
  __BASENAME__: JSON.stringify(process.env.BASENAME || ''),
};

// ------------------------------------
// Validate Vendor Dependencies
// ------------------------------------
const pkg = require('../package.json');

config.compiler_vendor = config.compiler_vendor
  .filter(dep => {
    if (pkg.dependencies[dep]) return true;

    debug(
      `Package "${dep}" was not found as an npm dependency in package.json; ` +
      `it won't be included in the webpack vendor bundle.
` +
      `Consider removing it from vendor_dependencies in ~/config/index.js`
    );
  });

// ------------------------------------
// Utilities
// ------------------------------------
config.utils_paths = (() => {
  const resolve = path.resolve;

  const basePath = (...args) =>
    resolve.apply(resolve, [config.path_base, ...args]);

  return {
    base: basePath,
    client: basePath.bind(null, config.dir_client),
    dist: basePath.bind(null, config.dir_dist),
  };
})();

export default config;
