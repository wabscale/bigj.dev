const Router = require('koa-router');
const {getFile, getFiles} = require('../db/queries');


const router = new Router({
  prefix: '/api'
});

router.use((ctx, next) => {
  if (!ctx.isAuthenticated()) {
    ctx.status = 403;
    ctx.redirect('/auth/login');
  }
  return next();
});

router.get('/files', async ctx => {
  ctx.type = 'application/json';
  ctx.body = JSON.stringify(
    await getFiles(),
  );
});

router.get('/files/:id', async ctx => {
  const {id} = ctx.params;

  const {user} = ctx.state;
  console.log(user, ctx.isAuthenticated());

  ctx.type = 'application/json';
  ctx.body = JSON.stringify(
    await getFile(id),
  );
});

router.post('/files/:id', async ctx => {
  const {id} = ctx.params;

  ctx.type = 'application/json';
  ctx.body = JSON.stringify(
    await getFile(id),
  )
});

module.exports = router;