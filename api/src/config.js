const fs = require('fs');
const path = require('path')

const {NODE_ENV} = process.env;

const config = {
  UPLOAD_PATH: '/data',
  DOMAIN: process.env.API_DOMAIN,
};

if (!fs.existsSync(config.UPLOAD_PATH))
  fs.mkdirSync(config.UPLOAD_PATH, {recursive:true});

module.exports = config;
