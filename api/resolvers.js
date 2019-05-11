const {getFile, getFiles, addUser} = require('../db');
const {generateToken, loadUser} = require('./auth');
// const passport = require('koa-passport');
const {AuthenticationError} = require('apollo-server-koa');

const requiresLogin = resolver => (parent, args, ctx, info) => {
  if (ctx.state.user)
    return resolver(parent, args, ctx, info);
  throw new AuthenticationError('Unauthorized');
};

fileReducer = (file) => ({
  fileID: file.id,
  filename: file.filename,
  isPublic: file.isPublic,
  size: file.size,
});

getAllFiles = async () => {
  const response = await getFiles();
  return response.map(file => fileReducer(file));
};

getFileById = async ({fileID}) => {
  const response = await getFileById(fileID);
  return response !== null ? fileReducer(response) : [];
};

getFilesById = ({fileIDs}) => {
  return Promise.all(
    fileIDs.map(fileID => getFileById(fileID)),
  );
};

createUser = async (username, password) => {
  try {
    await addUser(username, password);
    return {token:generateToken(username, password)};
  } catch (e) {
    return {token:''};
  }

};

const resolvers = {
  Query: {
    files: requiresLogin(() => getAllFiles()),
    file: requiresLogin((_, {fileID}) => getFileById(fileID)),
    me: requiresLogin((_, __, ctx) => ({
      username: ctx.state.user ? ctx.state.user.username : '',
      })),
    login: (_, {username, password}) => ({token:generateToken(username, password)}),
  },
  Mutation: {
    register: (_, {username, password}) => createUser(username, password),
  },
};

module.exports = resolvers;