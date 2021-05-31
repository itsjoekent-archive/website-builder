const https = require('https');
const express = require('express');
const pinoHttp = require('pino-http');
const loadSSLCertifications = require('../utils/loadSSLCertifications');
const logger = require('../utils/logger');

const bundler = require('../bundler');

const httpLogger = pinoHttp({ logger });

const app = express();
app.use(httpLogger);

const TEST_PAGE = {
  layout: [
    {
      id: '1',
      children: [
        {
          id: '2',
        }
      ],
    },
  ],
  components: {
    '1': {
      name: 'Container',
      package: '@material-ui/core',
    },
    '2': {
      name: 'Button',
      package: '@material-ui/core',
    },
  },
  dependencies: [
    ['@material-ui/core', '4.11.4'],
    ['@fluentui/react'],
  ],
};

app.get('/', (req, res) => {
  res.send('hi');

  bundler(TEST_PAGE).catch(error => logger.error(error));
});

app.get('/render/:bundleId', async (req, res) => {
  const path = require('path');
  const BLOCK_STORAGE_PATH = process.env.BLOCK_STORAGE_PATH;
  const { ssr: { default: render }} = require(path.join(BLOCK_STORAGE_PATH, `/bundles/${req.params.bundleId}/dist/ssr.js`));
  console.log(render);
  res.set('Content-Type', 'text/html');
  res.send(render(TEST_PAGE, {}));
});

loadSSLCertifications(process.env.SSL_KEY_FILE, process.env.SSL_CERT_FILE)
  .then(([key, cert]) => {
    const server = https.createServer({ key, cert }, app);

    const PORT = process.env.PORT;
    server.listen(PORT, () => logger.info(`Listening on port:${PORT}`));
  })
  .catch((error) => {
    logger.fatal(error);
    process.exit(1);
  });
