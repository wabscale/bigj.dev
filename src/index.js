const Koa = require('koa');
const koaviews = require('koa-views');
const logger = require('koa-logger');
const cors = require('@koa/cors');
const helmet = require('koa-helmet');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const {loadUser} = require('../auth');

const app = new Koa();
const PORT = process.env.PORT || 5000;

app.use(session({key: 'debug'}, app));
app.use(bodyParser({
  multipart: true,
  urlencode: true,
}));

// Must be used before any router is used
app.use(koaviews(__dirname + '/views', {
  extension: 'pug',
  map: {
    html: 'pug'
  }
}));

app.use(loadUser);

// logging
app.use(logger());

// security
app.use(helmet());
app.use(cors({
  origin: '*',
}));

// routes
app.use(require('./routes/index').routes());
app.use(require('./routes/files').routes());
// server
const server = app.listen(PORT, '0.0.0.0');

console.log(`Server listening on port: ${PORT}`);

module.exports = server;
