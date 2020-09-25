const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const FileManagerPlugin = require('filemanager-webpack-plugin');


module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new FileManagerPlugin({
      onEnd: {
        copy: [
          {source: './dist', destination: './elephant/dist'},
          {source: './manifest.json', destination: './elephant/manifest.json'},
        ],
        archive: [
          {source: './elephant', destination: './elephant-extension.zip'},
        ],
      },
    }),
  ],
});
