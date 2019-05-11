const Koa = require('koa');
const koaviews = require('koa-views');
const serve = require('koa-static');
const logger = require('koa-logger');
const cors = require('koa2-cors');
const helmet = require('koa-helmet');

const app = new Koa();
const PORT = process.env.PORT || 5000;

app.use(serve('src/static'));

// Must be used before any router is used
app.use(koaviews(__dirname + '/views', {
  extension: 'pug',
  map: {
    html: 'pug'
  }
}));

// routes
app.use(require('./routes/index').routes());
// app.use(require('./routes/auth').routes());

// logging
app.use(logger());

// security
app.use(cors({
  origin: 'api.localhost'
}));
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: [
      "'self'",
    ],
    styleSrc: [
      "'self'",
    ],
    scriptSrc: [
      "'self'",
      // process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : "",
    ],
    fontSrc: [
      'fonts.gstatic.com'
    ],
    connectSrc: [
      process.env.APIHOST || 'http://localhost8080/',
    ]
  }
}));

// server
const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
  console.log(`http://localhost:${PORT}/`);
});

module.exports = server;
