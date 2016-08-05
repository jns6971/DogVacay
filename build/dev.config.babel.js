import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import config from '../config';
// var CommonsChunkPlugin = require("../../lib/optimize/CommonsChunkPlugin");

const paths = config.utils_paths;

const webpackConfig = {
  context: config.path_base,
  devtool: config.compiler_dev_devtool,
  resolve: {
    root: paths.base(config.dir_src),
    modulesDirectories: [
      'src',
      'node_modules'
    ],
    extensions: ['', '.js', '.json']
  },
  module: {}
};

// ------------------------------------
// Entry Points
// ------------------------------------
webpackConfig.entry = {
  index: [
    'webpack-hot-middleware/client?reload=true',
    `${paths.base(config.dir_example)}\/${config.client_app}`],
  vendor: config.compiler_vendor,
};

// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
  filename: `[name].js`,
  path: paths.base(config.dir_dist),
  chunkFilename: '[name].js',
  publicPath: '/'
};

// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins = [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    inject: 'body',
    template: `${paths.base(config.dir_example)}\/${config.client_test_file}`,
  }),
  new ExtractTextPlugin('index.css', {
      allChunks: true
  }),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.IgnorePlugin(/webpack-stats\.json$/),
  new webpack.DefinePlugin(config.globals),
];

// ------------------------------------
// Loaders
// ------------------------------------
webpackConfig.module.loaders = [
  { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel'] },
  { test: /\.json$/, loader: 'json' }
];

export default webpackConfig;
