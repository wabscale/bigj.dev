const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const crypto = require("crypto");
const {AuthenticationError} = require('apollo-server-koa');
const Cookies = require('universal-cookie');

const {getUserByUsername, getUserById, addUser} = require('./db');
const {KEY_PATH} = require('./config.js');

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

generateKey = () => {
  let key = crypto.randomBytes(32).toString('hex');
  fs.writeFileSync(KEY_PATH, key);
  return key;
};

loadKey = () => {
  return fs.existsSync(KEY_PATH) ? fs.readFileSync(KEY_PATH) : generateKey();
};

generateToken = async (username, password) => {
  // await addUser('admin','password');
  const user = await getUserByUsername(username);
  if (user === null || !comparePass(password, user.password))
    throw new AuthenticationError('Unauthorized');
  return jwt.sign({id: user.id}, loadKey(), {expiresIn: '7d'});
};

loadUser = async (ctx, next) => {
  const {cookies} = new Cookies(ctx.request.headers.cookie);
  try {
    const loadedToken = ctx.req.headers.token || cookies.token;
    const token = jwt.verify(loadedToken, loadKey());
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