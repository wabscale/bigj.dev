const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const convert = require('koa-convert');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');
const crypto = require('crypto');


const {server} = require('./graphql/schema');
const {loadUser} = require('./auth');
const files = require('./graphql/files');
const fileRouter = require('./static/files.js');

const PORT = process.env.PORT || '5000';
const app = new Koa();

app.keys = [
  crypto.randomBytes(32).toString('hex'),
  crypto.randomBytes(32).toString('hex')
];
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
app.use(cors({
  origin: '*',
}));
server.applyMiddleware({app}); // /graphql

const router = new Router();
router.get('/', async ctx => {
  ctx.body = {
    success: true,
  };
});

/* if (process.env.NODE_ENV === 'development') {
 *   const koaPlayground = require('graphql-playground-middleware-koa').default;
 *   // console.log(koaPlayground)
 *   router.all('/playground', koaPlayground({endpoint: '/graphql'}));
 *   console.log(`playground: http://api.localhost:${PORT}/playground`);
 * } */

app.use(router.routes());
app.use(router.allowedMethods());
app.use(fileRouter.routes());


if (!!process.env.API_ROOT_PASSWORD) {
  const db = require('./db');
  db.getUserByUsername(
    'root'
  ).then(root => {
    if (root) {
      return console.log('root user already exists');
    }
    db.addUser(
      'root',
      process.env.API_ROOT_PASSWORD
    ).then(() => (
      console.log('added root user')
    )).catch(e => (
      console.error(e)
    ));
  })
  
}

console.log("Listening!");
app.listen(PORT, '0.0.0.0');


