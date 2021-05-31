const fs = require('fs').promises;
const path = require('path');

const BLOCK_STORAGE_PATH = process.env.BLOCK_STORAGE_PATH;

const customFs = {};

[
  'access',
  'appendFile',
  'chmod',
  'chown',
  'lchmod',
  'lchown',
  'lstat',
  'mkdir',
  'open',
  'readdir',
  'readFile',
  'readlink',
  'realpath',
  'rmdir',
  'stat',
  'writeFile',
].forEach((functionName) => {
  customFs[functionName] = (relativePath, ...args) => fs[functionName](
    path.join(BLOCK_STORAGE_PATH, relativePath),
    ...args,
  );
});

module.exports = customFs;
