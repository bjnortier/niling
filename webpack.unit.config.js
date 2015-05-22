module.exports = {
  entry: {
    'unit.test': 'mocha!./test/unit/all.browser.js',
  },
  output: {
    filename: './test/unit/[name].bundle.js'
  }
};