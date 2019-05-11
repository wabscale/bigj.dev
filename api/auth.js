const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const crypto = require("crypto");
const {getUserByUsername, getUserById, addUser} = require('../db');
const {keyPath} = require('../config.js');
const {AuthenticationError} = require('apollo-server-koa');

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

generateKey = () => {
  let key = crypto.randomBytes(32).toString('hex');
  fs.writeFileSync(keyPath, key);
  return key;
};

loadKey = () => {
  return fs.existsSync(keyPath) ? fs.readFileSync(keyPath) : generateKey();
};

generateToken = async (username, password) => {
  // await addUser('admin','password');
  const user = await getUserByUsername(username);
  if (user === null || !comparePass(password, user.password))
    throw new AuthenticationError('Unauthorized');
  return jwt.sign({id: user.id}, loadKey(), {expiresIn: '1h'});
};

loadUser = async (ctx, next) => {
  try {
    const token = jwt.verify(ctx.req.headers.token,loadKey());
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