module.exports = {
  entry: {
    'sync.test': "./test/functional/src/sync.test.js"
  },
  output: {
    path: 'test/functional/lib/',
    filename: "[name].bundle.js"
  },
  devtool: "#inline-source-map"
};