var webpack = require('webpack');
var ignore = new webpack.IgnorePlugin(new RegExp("^(sqlite3)$"));

module.exports = {
  entry: {
    'browser.test': './test/functional/src/browser.test.js'
  },
  output: {
    path: 'test/functional/lib/',
    filename: '[name].bundle.js'
  },
  devtool: '#inline-source-map',
  plugins: [ignore],
};