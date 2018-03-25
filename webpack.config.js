/* eslint-disable */
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const babelExclude = /node_modules/

var config = {
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    libraryTarget: 'commonjs',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: babelExclude,
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  externals: /^(lodash(\/.*))$/,
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.ENV': JSON.stringify(process.env.ENV),
    }),
  ],
  target: 'web'
}

module.exports = config
