module.exports = {
  entry: {
    'unit.test': 'mocha!./test/unit/all.js',
  },
  output: {
    filename: './test/unit/[name].bundle.js'
  }
};