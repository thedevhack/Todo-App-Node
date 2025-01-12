// webpack.config.js
const path = require('path');

module.exports = {
  entry: './index.js', // Your entry file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  mode: 'production', // or 'development'
};
