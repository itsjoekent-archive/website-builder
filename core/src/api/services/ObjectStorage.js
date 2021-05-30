const aws = require('aws-sdk');

const WEBSITE_BUCKET = 'www';

const spacesEndpoint = new aws.Endpoint(process.env.OBJECT_STORAGE_ENDPOINT);

const client = new aws.S3({
  endpoint: spacesEndpoint,
  s3ForcePathStyle: (process.env.OBJECT_STORAGE_PATH_STYLE || '').toLowerCase() === 'true',
  signatureVersion: 'v4',
  accessKeyId: process.env.OBJECT_STORAGE_ACCESS_KEY,
  secretAccessKey: process.env.OBJECT_STORAGE_SECRET_KEY,
});

module.exports = {
  WEBSITE_BUCKET,
  client,
};
