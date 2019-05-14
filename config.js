const fs = require('fs');
const path = require('path')

const config = {
  KEY_PATH: '.data/site.key',
  UPLOAD_PATH: path.join(__dirname, '.data/files/'),
};

if (!fs.existsSync(config.UPLOAD_PATH))
  fs.mkdirSync(config.UPLOAD_PATH, {recursive:true});

module.exports = config;