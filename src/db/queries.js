const bcrypt = require('bcryptjs');
const knex = require('./index');

getUser = id => knex('User').select('*').where({
  id: parseInt(id),
});

addUser = ({
  username,
  password
}) => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(password, salt);
  return knex('User').insert({
    username,
    password: hash
  }).returning('*');
};

getFiles = () => knex('File').select('*');

getFile = id => {
  return knex('File').select('*').where({
    id
  });
};

addFile = ({id, filename}) => {
  return knex('File').insert({
    id,
    filename,
  }).returning('*');
};

module.exports = {
  // User
  getUser,
  addUser,

  // File
  getFile,
  addFile,
  getFiles,

  // OTP
};
