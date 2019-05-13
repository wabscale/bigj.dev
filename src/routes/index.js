const Router = require('koa-router');
const send = require('koa-send');

const router = new Router();

router.get('/', async (ctx, next) => {
  await ctx.render('index.pug', {
    text: 'test me this',
    csrf_token: ctx.csrf,
  });
  await next();
});

router.get('/js/:path', async (ctx, next) => {
  await send(ctx, ctx.path, { root: './src/static/' });
  await next();
});

router.get('/favicon.ico', async (ctx, next) => {
  await send(ctx, 'favicon.ico', {root:'./src/static'});
  await next();
});

module.exports = router;
