const fs = require('fs');
const path = require('path')

const {NODE_ENV} = process.env;

const config = {
  UPLOAD_PATH: path.join(__dirname, '.data/files/'),
};

if (!fs.existsSync(config.UPLOAD_PATH))
  fs.mkdirSync(config.UPLOAD_PATH, {recursive:true});

module.exports = config;
