const db = require('../models');
const bcrypt = require('bcryptjs');


module.exports = {
  // get
  getFiles: async () => await db.File.findAll(),
  getFileById: async id => {
    let files = await db.File.findAll({where: {id,}});
    return files.length === 1 ? files[0] : null;
  },
  getUserById: async id => {
    let users = await db.User.findAll({where: {id,}});
    return users.length === 1 ? users[0] : null;
  },
  getUserByUsername: async username => {
    let users = await db.User.findAll({where: {username,}});
    return users.length === 1 ? users[0] : null;
  },
  getConfig: async (key) => {
    let values = await db.Config.findAll({where: {key,}});
    return values.length >= 1 ? values : null;
  },

  // add
  addFile: async ({filename, isPublic = false, size = null}) => (
    await db.File.create({filename, isPublic, size})
  ),
  addUser: async (username, password) => (
    await db.User.create({username, password: bcrypt.hashSync(password, 10)})
  ),
  addConfig: (key, value) => db.Config.create({key, value}),

  // delete
  deleteFileByFilename: async ({filename}) => (
    await db.File.destroy({where: {filename,}})
  ),
  deleteFileById: async ({id}) => (
    await db.File.destroy({where: {id,}})
  ),

  // update
  updateFile: async (file) => (
    await db.File.update({...file}, {where: {id: file.id}})
  ),
};