const Router = require('koa-router');
// const {getFiles} = require('../../db');

const router = new Router();

// router.use((ctx, next) => {
//   if (!ctx.isAuthenticated()) {
//     ctx.status = 403;
//     ctx.redirect('/auth/login');
//   }
//   return next();
// });

router.get('/', async ctx => {
  await ctx.render('index.pug', {
    text: 'test me this',
    csrf_token: ctx.csrf,
    // files: await getFiles(),
  });
});


module.exports = router;
