var webpack = require('webpack');
var ignore = new webpack.IgnorePlugin(new RegExp('sqlite3'));

module.exports = {
  entry: {
    'indexeddbcontainer.test': './test/functional/src/indexeddbcontainer.test.js',
    // 'wsbrowser.test': './test/functional/src/wsbrowser.test.js',
  },
  output: {
    path: 'test/functional/lib/',
    filename: '[name].bundle.js'
  },
  devtool: '#inline-source-map',
  plugins: [ignore],
};