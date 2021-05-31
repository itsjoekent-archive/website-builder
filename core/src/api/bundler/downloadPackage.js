const { join } = require('path');
const logger = require('../utils/logger');
const BlockStorage = require('../services/BlockStorage');

const exec = require('util').promisify(require('child_process').exec);

const BLOCK_STORAGE_PATH = process.env.BLOCK_STORAGE_PATH;

async function downloadPackage(bundleId, name, version) {
  const relativeBundleFolder = `/bundles/${bundleId}`;

  try {
    await BlockStorage.mkdir(relativeBundleFolder, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      return error;
    }
  }

  try {
    logger.info(`Installing package... "${name}@${version || 'latest'}"`);
    const packagesFolder = join(BLOCK_STORAGE_PATH, relativeBundleFolder);
    await exec(`cd ${packagesFolder} && npm install ${name}${version ? `@${version}` : ''}`);
  } catch (error) {
    return error;
  }
}

module.exports = downloadPackage;
