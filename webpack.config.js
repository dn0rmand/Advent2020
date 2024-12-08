const path = require('path');

module.exports = {
  entry: './app.js',
  output: {
    path: path.resolve(__dirname),
    filename: '_bundle.js'
  },
  node: {
    global: false,
    __filename: false,
    __dirname: false,
  }
};