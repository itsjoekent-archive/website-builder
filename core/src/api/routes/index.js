const https = require('https');
const express = require('express');
const pinoHttp = require('pino-http');
const loadSSLCertifications = require('../utils/loadSSLCertifications');
const logger = require('../utils/logger');

const httpLogger = pinoHttp({ logger });

const app = express();
app.use(httpLogger);

app.get('/', (req, res) => {
  res.send('hi');
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
