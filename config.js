const fs = require('fs');
const path = require('path')

const {NODE_ENV} = process.env;

const config = {
  UPLOAD_PATH: path.join(__dirname, '.data/files/'),
  DOMAIN: NODE_ENV === 'production' ?  'https://f.bigj.dev' : 'http://localhost:5000',
  OTP_TIMEOUT: 500 * 1000
};

if (!fs.existsSync(config.UPLOAD_PATH))
  fs.mkdirSync(config.UPLOAD_PATH, {recursive:true});

module.exports = config;
