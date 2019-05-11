const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
// const passport = require('koa-passport');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const convert = require('koa-convert');
const helmet = require('koa-helmet');

const {server} = require('./schema');
const files = require('./files');
const {loadUser} = require('./auth');

const PORT = process.env.PORT || '8080';
const app = new Koa();

app.keys = ['DEBUG', 'DEBUG'];
app.use(loadUser);
app.use(convert(session(app)));
app.use(helmet());
app.use(files.update);

// body parser
app.use(bodyParser({
  multipart: true,
  urlencode: true,
}));


app.use(logger());
server.applyMiddleware({app}); // /graphql

const router = new Router();
router.get('/', async ctx => {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
  ctx.body = {
    success: true,
  };
});

if (process.env.NODE_ENV === 'development') {
  const koaPlayground = require('graphql-playground-middleware-koa').default;
  // console.log(koaPlayground)
  router.all('/playground', koaPlayground({endpoint: '/graphql'}));
  console.log(`playground: http://localhost:${PORT}/playground`);
}

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Listening!");
app.listen(PORT);


