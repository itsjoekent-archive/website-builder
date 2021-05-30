const express = require('express');
const pino = require('pino');
const pinoHttp = require('pino-http');
const aws = require('aws-sdk');

const logger = pino();
const httpLogger = pinoHttp({ logger });

const app = express();
app.use(httpLogger);

const spacesEndpoint = new aws.Endpoint(process.env.OBJECT_STORAGE_ENDPOINT);

const objectStorageClient = new aws.S3({
  endpoint: spacesEndpoint,
  s3ForcePathStyle: (process.env.OBJECT_STORAGE_PATH_STYLE || '').toLowerCase() === 'true',
  signatureVersion: 'v4',
  accessKeyId: process.env.OBJECT_STORAGE_ACCESS_KEY,
  secretAccessKey: process.env.OBJECT_STORAGE_SECRET_KEY,
});

app.get('/', (req, res) => {
  res.send('hi');
});

(async function() {
  setTimeout(() => {
    objectStorageClient.putObject({
      Bucket: 'www',
      Key: 'index.html',
      Body: '<h1>Hello from nodejs</h1>',
    }, console.log);
  }, 5000);
})();

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Listening on port:${PORT}`));
