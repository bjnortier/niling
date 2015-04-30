module.exports = {
  entry: {
    'browser.test': './test/functional/src/browser.test.js'
  },
  output: {
    path: 'test/functional/lib/',
    filename: '[name].bundle.js'
  },
  devtool: '#inline-source-map'
};