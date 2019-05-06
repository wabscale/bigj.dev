const Router = require('koa-router');
const passport = require('koa-passport');
const {getUser} = require('../db/queries');

const router = new Router({
  prefix: '/auth'
});

router.get('/login', async ctx => {
  await ctx.render('login.pug', {
    csrf_token: ctx.csrf,
  });
});

router.post('/login', async ctx => {
  return passport.authenticate('local', (err, user) => {
    if (user) {
      console.log(user);
      ctx.login(user);
      ctx.redirect('/');
    } else {
      ctx.redirect('/auth/login');
    }
  })(ctx);
});

router.get('/logout', ctx => {
  if (ctx.isAuthenticated()) {
    ctx.logout();
  }
  ctx.redirect('/auth/login');
});

module.exports = router;