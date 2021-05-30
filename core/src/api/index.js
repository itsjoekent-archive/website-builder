const logger = require('./utils/logger');
const ObjectStorage = require('./services/ObjectStorage');

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
