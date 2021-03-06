/* eslint-disable */
const fs = require('fs');
let nvmRcVersion = fs.readFileSync('./.nvmrc', 'utf8').replace(/[^0-9.]/g, "");
let nodeProcessVersion = process.version.replace(/[^0-9.]/g, "");

if(nodeProcessVersion != nvmRcVersion) {
  console.error(`DV#> Please make sure node is running under v${nvmRcVersion}`);
  process.exit();
}

// init globals
require('../.darvinconf.js');

const path = require('path');
const basePath = process.cwd();
const merge = require('webpack-merge');

const webpackConfig = require('../webpack.config');
const { getDarvinRC, createDynamicRequireArray } = require('./helpers/config-helpers');

let darvinRcString = getDarvinRC();
let dynamicRequireArr = createDynamicRequireArray(darvinRcString);

for (var i = 0; i < dynamicRequireArr.length; i++) {
  eval(dynamicRequireArr[i]);
}

const settings = {
  entry: {
    "js/main": ["./src/js/main.js"]
  },
  output: {
    devtoolLineToLine: false,
    path: path.resolve(basePath, 'dist'),
    pathinfo: false,
    filename: global.server.assets + '/[name].js',
    chunkFilename: global.server.assets + '/async/[name].[contenthash].js',
    publicPath: '/'
  },
  devtool: 'cheap-module-eval-source-map'
};

module.exports = eval('merge(' + darvinRcString + ')');
