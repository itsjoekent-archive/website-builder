const logger = require('./utils/logger');

logger.debug('Starting up...');

require('./routes');

// (async function() {
//   setTimeout(() => {
//     ObjectStorage.client.putObject({
//       Bucket: 'www',
//       Key: 'test/index.html',
//       Body: '<h1>Hello from nodejs</h1>',
//     }, console.log);
//   }, 5000);
// })();

// download material-ui
// create webpack build
// render page to cdn
// hydrate page in browser
