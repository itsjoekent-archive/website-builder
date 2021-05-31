const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');
const BlockStorage = require('../services/BlockStorage');

const BLOCK_STORAGE_PATH = process.env.BLOCK_STORAGE_PATH;

async function copyHelperFiles(bundleId) {
  try {
    logger.info('Copying helper files...');

    await BlockStorage.mkdir(`/bundles/${bundleId}/helpers`);

    const helperDirectory = await fs.readdir(path.join(__dirname, '/helpers'));
    const helperFiles = helperDirectory.filter((file) => file.endsWith('.js') && !file.endsWith('.test.js'));

    for (const helperFile of helperFiles) {
      await fs.copyFile(
        path.join(__dirname, `helpers/${helperFile}`),
        path.join(BLOCK_STORAGE_PATH, `/bundles/${bundleId}/helpers/${helperFile}`),
      );
    }
  } catch (error) {
    return error;
  }
}

module.exports = copyHelperFiles;
