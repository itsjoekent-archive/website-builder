const fs = require('fs').promises;
const path = require('path');

async function loadSSLCertifications(keyName, certificateName) {
  return Promise.all([
    fs.readFile(path.join(__dirname, `../../../certificates/${keyName}`)),
    fs.readFile(path.join(__dirname, `../../../certificates/${certificateName}`)),
  ]);
}

module.exports = loadSSLCertifications;
