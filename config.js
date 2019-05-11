const fs = require('fs');

const config = {
  keyPath: '.data/site.key',
  uploadPath: '.data/files',
};

if (!fs.existsSync(config.uploadPath))
  fs.mkdirSync(config.uploadPath, {recursive:true});

module.exports = config;