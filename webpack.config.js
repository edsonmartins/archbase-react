const webpack = require('webpack');
const path = require('path');
const env = require('yargs').argv.env; // use --env with webpack 2
const pkg = require('./package.json');
var nodeExternals = require('webpack-node-externals');

let libraryName = pkg.name;

let outputFile, mode;

mode = 'production';
outputFile = libraryName + '.min.js';

const config = {
  mode: mode,
  entry: __dirname + '/src/index.ts',
  devtool: 'source-map',
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()],
  output: {
    path: __dirname + '/dist',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
  module: {
    rules: [
      {
        // this is so that we can compile any React,
        // ES6 and above into normal ES5 syntax
        test: /\.(js|jsx)$/,
        // we do not want anything from node_modules to be compiled
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: [/\.ts$/, /\.tsx$/],
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(css|scss)$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader', // compiles Sass to CSS, using Node Sass by default
        ],
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
        loader: 'file-loader',
      },
    ],
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js', '.jsx', '.tsx', '.ts', '.js'],
  },
};

module.exports = config;
