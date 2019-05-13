const fs = require('fs');

const config = {
  KEY_PATH: '.data/site.key',
  UPLOAD_PATH: '.data/files',
};

if (!fs.existsSync(config.UPLOAD_PATH))
  fs.mkdirSync(config.UPLOAD_PATH, {recursive:true});

module.exports = config;