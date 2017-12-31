const path = require('path');

module.exports = {
  entry: './src/client/index.js',
  output: {
    path: path.resolve('public/js'),
    filename: 'script.js',
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/, query: { presets: ['babel-preset-env'], plugins: ['babel-plugin-transform-object-rest-spread', 'babel-plugin-transform-class-properties'] } },
    ],
  },
  devtool: '#source-map',
  resolve: {
    extensions: ['.js'],
  },
};
