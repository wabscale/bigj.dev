const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const passport = require('koa-passport');
const koaviews = require('koa-views');
const CSRF = require('koa-csrf');
const serve = require('koa-static');
const convert = require('koa-convert');

const app = new Koa();
const PORT = process.env.PORT || 5000;

// sessions
app.keys = ['DEBUG'];
app.use(convert(session(app)));

// body parser
app.use(bodyParser({
  multipart: true,
  urlencode: true,
}));

app.use(serve('src/static'));

// Must be used before any router is used
app.use(koaviews(__dirname + '/views', {
  extension: 'pug',
  map: {
    html: 'pug'
  }
}));


app.use(new CSRF({
  invalidTokenMessage: 'Invalid CSRF token',
  invalidTokenStatusCode: 403,
  excludedMethods: ['GET', 'HEAD', 'OPTIONS'],
  disableQuery: false
}));


// authentication
require('./auth');
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use(require('./routes/index').routes());
app.use(require('./routes/auth').routes());
app.use(require('./routes/api').routes());

// logging
app.use(require('./logger'));

// server
const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
  console.log(`http://localhost:${PORT}/`);
});

module.exports = server;
