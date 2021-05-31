const path = require('path');

const NODE_ENV = process.env.NODE_ENV;
const BLOCK_STORAGE_PATH = process.env.BLOCK_STORAGE_PATH;

function baseWebpackConfig(bundleId) {
  return {
    mode: NODE_ENV,
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
            ]
          },
        },
      ],
    },
    output: {
      path: path.join(BLOCK_STORAGE_PATH, `/bundles/${bundleId}/dist`),
    },
  };
}

module.exports = baseWebpackConfig;
