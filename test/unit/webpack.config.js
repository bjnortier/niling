module.exports = {
  entry: {
    'unit.test': 'mocha!./all.test.js',
  },
  output: {
    filename: '[name].bundle.js'
  }
};