// tests
// docker, web, worker, redis
// bee-queue
// webpack builds
// upload to S3 compaitable object storage (mino locally, CDN layer over it?)
// authentication
// sentry error reporting

const crypto = require('crypto');
const express = require('express');

const app = express();

/**
 * Get the unique bundle hash name for a given set of packages.
 * 
 * @param {Array<String>} packages Array of package identifiers
 * @returns {String} bundle hash name
 */
function getBundleHash(packages) {
  const hash = crypto.createHash('sha256');
  hash.update(`packages:${packages.join(',')}`);

  return hash.digest('hex');
}

/**
 * Check if a bundle exists on disk
 * 
 * @param {String} bundleHashId
 * @returns {Boolean}
 */
async function checkIfBundleExists(bundleHashId) {
  return false;
}

/**
 * Check the status of a bundle build job.
 * 
 * @param {String} bundleHashId 
 * @returns {Object<String:Boolean>} Key is one of the following, "hasError", "inProgress", "hasCompleted"
 */
async function getJobStatus(bundleHashId) {
  // read meta file
  // if has error, return { hasError: true }
  // if incomplete, return { inProgress: true }
  return { hasCompleted: true };
}

/**
 * Schedule a set of packages to be assembled into a Webpack bundle.
 * 
 * @param {String} bundleHashId Hash id pertaining to this bundle
 * @param {Array<String>} packages Array of package identifiers
 */
function scheduleBundleBuild(bundleHashId, packages) {
  // https://github.com/bee-queue/bee-queue

  // webpack build
  // upload to disk storage, cdn
  // meta file
  //  - packages
  //  - time created
}

app.get('/bundle', async (req, res) => {
  const { query } = req;

  if (!query || !query['packages']) {
    return res.status(400).json({ error: 'Missing package list' });
  }

  const packagesQuery = query['packages'].toLowerCase().trim();
  const packages = packagesQuery.split(',');

  if (!packages.length) {
    return res.status(400).json({ error: 'Missing package list' });
  }

  const invalidPackages = packages.filter((packageIdentifier) => {
    const [vendor, rest] = packageIdentifier.split('/');
    const [name, version] = rest.split(':');

    if (!vendor || !vendor.startsWith('@') || !vendor.replace('@', '').length) {
      return packageIdentifier;
    }

    if (!name || !version) {
      return packageIdentifier;
    }

    if (isNaN(version.replace(/\./g, ''))) {
      return packageIdentifier;
    }

    return false;
  }).filter((packageIdentifier) => !!packageIdentifier);

  if (invalidPackages.length) {
    return res.status(400).json({ error: `Invalid packages given, "${invalidPackages.join('", "')}"` });
  }

  const bundleHashId = getBundleHash(packages);
  const bundleExists = await checkIfBundleExists(bundleHashId);

  if (bundleExists instanceof Error) {
    console.error(bundleExists);
    return res.status(500).json({ error: 'Encountered error creating new bundle' });
  }

  if (!bundleExists) {
    scheduleBundleBuild(bundleHashId, packages);
    return res.status(202).json({ bundleId: bundleHashId });
  }

  return res.status(200).json({ publicPath: `/.../${bundleHashId}` });
});

app.get('/job/:bundleHashId', async (req, res) => {
  const { params: { bundleHashId } } = req;
  if (!bundleHashId) {
    return res.status(400).json({ error: 'Missing job id' });
  }

  const bundleExists = await checkIfBundleExists(bundleHashId);

  if (bundleExists instanceof Error) {
    console.error(bundleExists);
    return res.status(500).json({ error: 'Encountered error creating new bundle' });
  }

  if (!bundleExists) {
    return res.status(404).json({ error: 'No bundle exists for the given identifier' });
  }

  const jobStatus = await getJobStatus(jobId);

  if (jobStatus instanceof Error) {
    console.error(bundleExists);
    return res.status(500).json({ error: 'Encountered error checking bundle status' });
  }

  return res.status(200).json({ jobStatus });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Omnibus listening on port ${PORT}`);  
});