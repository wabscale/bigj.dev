const Router = require('koa-router');
const send = require('koa-send');
const {getFileByFilename, addDownload, verifyOtp} = require('../db');
const {UPLOAD_PATH} = require('../config.js');

const router = new Router({
  prefix: '/f',
});

router.get('/:requestedFilename', async (ctx, next) => {
  /*
  This function will be called any time a file is requested. It should
  handle verifying that the file exists, and that a download would be allowed.
  This function will take into account whether the file is public and the otp
  to decide if the download will be allowed.
   */
  const {user} = ctx.state;
  const {otp} = ctx.request.query;

  /*
   ctx.request.ip will be the traefik ip. We want to record the client ip,
   that will likely be in the x-forwarded-for header.
   */
  const ipAddress = ctx.request.header['x-forwarded-for'] || ctx.request.ip;
  const {requestedFilename} = ctx.params;
  const file = await getFileByFilename(requestedFilename);
  if (!file) {
    // If file does not exist, record the download anyway.
    return await addDownload(0, ipAddress, false);
  }
  const {id} = file;

  if ((!file.isPublic && !user) && !(await verifyOtp(otp, file))) {
    /*
     If file download was rejected, we're still going to record
     that a download was attempted.
     */
    return await addDownload(id, ipAddress, false);
  }
  await addDownload(id, ipAddress, true);
  await send(ctx, requestedFilename, { root: UPLOAD_PATH });
  await next();
});

module.exports = router;
