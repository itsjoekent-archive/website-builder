const crypto = require('crypto');
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const downloadPackage = require('./downloadPackage');
const copyHelperFiles = require('./copyHelperFiles');
const baseWebpackConfig = require('./baseWebpackConfig');
const entrypointGenerator = require('./entrypointGenerator');
const ObjectStorage = require('../services/ObjectStorage');
const logger = require('../utils/logger');

const BLOCK_STORAGE_PATH = process.env.BLOCK_STORAGE_PATH;

const requirements = [
  ['react', '17'],
  ['react-dom', '17'],
];

const runWebpack = require('util').promisify(webpack);

async function createWebBundle(page) {
  const bundleId = crypto.randomUUID();
  logger.info(`Creating bundle... id:${bundleId}`);

  for (const requirement of requirements) {
    const [package, version] = requirement;
    const downloadResult = await downloadPackage(bundleId, package, version);

    if (downloadResult instanceof Error) {
      throw downloadResult;
    }
  }

  const { dependencies } = page;
  logger.info(`Installing ${dependencies.length} component package(s)...`);

  for (package of dependencies) {
    const [name, version] = package;
    const result = await downloadPackage(bundleId, name, version);

    if (result instanceof Error) {
      throw result;
    }
  }

  const copyResult = await copyHelperFiles(bundleId);
  if (copyResult instanceof Error) throw copyResult;

  const entrypointResult = await entrypointGenerator(page, bundleId);
  if (entrypointResult instanceof Error) throw entrypointResult;

  logger.info('Running webpack build...');
  const stats = await runWebpack([
    merge(
      baseWebpackConfig(bundleId),
      {
        entry: path.join(BLOCK_STORAGE_PATH, `/bundles/${bundleId}/hydrate.js`),
        output: {
          filename: 'hydrate.js',
        },
      },
    ),
    merge(
      baseWebpackConfig(bundleId),
      {
        entry: path.join(BLOCK_STORAGE_PATH, `/bundles/${bundleId}/ssr.js`),
        output: {
          filename: 'ssr.js',
          library: {
            name: 'ssr',
            type: 'commonjs',
          },
        },
        target: 'node',
      },
    ),
  ]);

  logger.debug(stats);

  // upload result to cdn
  logger.info(`Completed bundle build process id:${bundleId}`);
}

module.exports = createWebBundle;
