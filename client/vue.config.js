/* eslint-disable linebreak-style */
const path = require('path');

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        services: path.resolve(__dirname, './src/services'),
      },
    },
  },
};
