const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const knex = require('./db');

const options = {};

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  return knex('User').where({
    id
  }).first().then(user => {
    done(null, user);
  }).catch(
    err => {
      done(err, null);
    }
  );
});

passport.use(new LocalStrategy(options, (username, password, done) => {
  knex('User').where({
    username,
  }).first().then(user => {
    if (!user)
      return done(null, false);
    if (!comparePass(password, user.password)) {
      return done(null, false);
    } else {
      return done(null, user);
    }
  }).catch((err) => {
    return done(err);
  });
}));
