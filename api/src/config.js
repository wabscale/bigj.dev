const fs = require('fs');
const path = require('path')

const {NODE_ENV} = process.env;

const config = {
  UPLOAD_PATH: '/data',
  DOMAIN: 'https://f.bigj.dev',
  OTP_TIMEOUT: 500 * 1000
};

if (!fs.existsSync(config.UPLOAD_PATH))
  fs.mkdirSync(config.UPLOAD_PATH, {recursive:true});

module.exports = config;
