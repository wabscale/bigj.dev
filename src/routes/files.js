const Router = require('koa-router');
const send = require('koa-send');
const {getFileByFilename, addDownload} = require('../../db');
const {UPLOAD_PATH} = require('../../config');

const router = new Router({
  prefix: '/f',
});

router.get('/:requestedFilename', async (ctx, next) => {
  const {user} = ctx.state;
  const ipAddress = ctx.request.header['X-Forwarded-For'] || ctx.request.ip;
  const {requestedFilename} = ctx.params;
  const file = await getFileByFilename(requestedFilename);
  if ((!file) || (!file.isPublic && !user))
    return addDownload(file.id, ipAddress, false);
  addDownload(file.id, ipAddress, true);
  await send(ctx, requestedFilename, { root: UPLOAD_PATH });
  await next();
});

module.exports = router;