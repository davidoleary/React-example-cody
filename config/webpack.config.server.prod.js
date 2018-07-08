const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const paths = require('./paths');

const env = process.env.NODE_ENV === undefined ? 'production' : process.env.NODE_ENV;

module.exports = {
  target: 'node',
  externals: [nodeExternals()],
  entry: ['babel-polyfill', paths.serverAppJs],
  output: {
    path: paths.serverBuild,
    filename: '[name].js',
    chunkFilename: '[name].[chunkhash:8].chunk.js',
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json'],
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      ENVIRONMENT: JSON.stringify(env),
    }),
  ],
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: [
          {
            options: {
              eslintPath: require.resolve('eslint'),

            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        include: paths.serverSrc,
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', {
                targets: {
                  node: 'current',
                },
              }],
            ],
          },
        },
      },
    ],
  },
  node: {
    console: true,
    net: 'empty',
    tls: 'empty',
    fs: 'empty',
    dns: 'empty',
    child_process: 'empty',
    dgram: 'empty',
    module: 'empty',
  },
};
