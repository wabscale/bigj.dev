const Koa = require('koa');
const koaviews = require('koa-views');
const logger = require('koa-logger');
const cors = require('@koa/cors');
const helmet = require('koa-helmet');

const app = new Koa();
const PORT = process.env.PORT || 5000;


// Must be used before any router is used
app.use(koaviews(__dirname + '/views', {
  extension: 'pug',
  map: {
    html: 'pug'
  }
}));


// logging
app.use(logger());

// security
app.use(helmet());
// app.use(helmet.contentSecurityPolicy({
//   directives: {
//     defaultSrc: [
//       "'self'",
//     ],
//     styleSrc: [
//       "'self'",
//       "'inline'"
//     ],
//     scriptSrc: [
//       "'self'",
//       process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : "'unsafe-eval'",
//     ],
//     fontSrc: [
//       'fonts.gstatic.com'
//     ],
//     connectSrc: [
//       process.env.APIHOST || 'http://api.localhost:8080/',
//     ]
//   }
// }));
app.use(async (ctx, next) => {
  await next();
});
app.use(cors({
  origin: '*',
}));

// routes
app.use(require('./routes/index').routes());
// server
const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
  console.log(`http://localhost:${PORT}/`);
});

module.exports = server;
