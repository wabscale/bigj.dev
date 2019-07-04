const Router = require('koa-router');
const send = require('koa-send');
const {getFileByFilename, addDownload, verifyOtp} = require('../../db');
const {UPLOAD_PATH} = require('../../config');

const router = new Router({
  prefix: '/f',
});

router.get('/:requestedFilename', async (ctx, next) => {
  const {user} = ctx.state;
  const {otp} = ctx.request.query;
  const ipAddress = ctx.request.header['X-Forwarded-For'] || ctx.request.ip;
  const {requestedFilename} = ctx.params;
  const file = await getFileByFilename(requestedFilename);
  if (!file) {
    return await addDownload(0, ipAddress, false);
  }
  const {id} = file;

  if ((!file.isPublic && !user) && !(await verifyOtp(otp))) {
    return await addDownload(id, ipAddress, false);
  }
  await addDownload(id, ipAddress, true);
  await send(ctx, requestedFilename, { root: UPLOAD_PATH });
  await next();
});

module.exports = router;
