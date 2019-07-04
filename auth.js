const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const crypto = require("crypto");
const {AuthenticationError} = require('apollo-server-koa');
const Cookies = require('universal-cookie');

const {getUserByUsername, getUserById, addUser, getConfig, addConfig} = require('./db');

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

generateKey = async () => {
  let key = crypto.randomBytes(32).toString('hex');
  await addConfig('siteKey', key);
  return key;
};

loadKey = async () => {
  const key = await getConfig('siteKey');
  return key ? key.value : await generateKey();
};

generateToken = async (username, password) => {
  // await addUser('admin','password');
  const user = await getUserByUsername(username);
  if (user === null || !comparePass(password, user.password))
    throw new AuthenticationError('Unauthorized');
  return jwt.sign({id: user.id}, await loadKey(), {expiresIn: '7d'});
};

loadUser = async (ctx, next) => {
  const {cookies} = new Cookies(ctx.request.headers.cookie);
  try {
    const loadedToken = ctx.req.headers.token || cookies.token;
    const token = jwt.verify(loadedToken, await loadKey());
    ctx.state.user = await getUserById(token.id);
  } catch(err) {}
  await next();
};

setUser = (ctx, username) => {
  user = getUserByUsername(username);
};

module.exports = {
  generateToken,
  loadUser,
};
