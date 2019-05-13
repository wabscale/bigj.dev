const {
  getFiles,
  addUser,
  updateFile,
  getDownloadHistory,
  getOTP,
  getFileById,
  deleteFileById,
} = require('../db');
const {generateToken, loadUser} = require('./auth');
// const passport = require('koa-passport');
const {AuthenticationError} = require('apollo-server-koa');
const fs = require('fs');
const {UPLOAD_PATH} = require('../config');

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

getFile = async (fileID) => {
  const response = await getFileById(fileID);
  return response !== null ? fileReducer(response) : null;
};

getFilesById = ({fileIDs}) => {
  return Promise.all(
    fileIDs.map(fileID => getFileById(fileID)),
  );
};

createUser = async (username, password) => {
  try {
    await addUser(username, password);
    return {token: generateToken(username, password)};
  } catch (e) {
    return {token: ''};
  }
};

yeetFile = async (id) => {
  const file = await getFileById(id);
  await deleteFileById(id);
  return fileReducer(file);
};

const storeFS = ({ stream, filename }) => {
  const path = `${UPLOAD_PATH}/${filename}`;
  return new Promise((resolve, reject) =>
    stream
      .on('error', error => {
        if (stream.truncated)
        // Delete the truncated file.
          fs.unlinkSync(path);
        reject(error)
      })
      .pipe(fs.createWriteStream(path))
      .on('error', error => reject(error))
      .on('finish', () => resolve({ path }))
  )
}

const resolvers = {
  Query: {
    files: requiresLogin(() => getAllFiles()),
    file: requiresLogin((_, {fileID}) => getFile(fileID)),
    me: requiresLogin((_, __, ctx) => ({
      username: ctx.state.user ? ctx.state.user.username : '',
    })),
    login: (_, {username, password}) => ({token: generateToken(username, password)}),
    fileHistory: requiresLogin((_, {fileID}) => getDownloadHistory(fileID)),
    getOTP: requiresLogin((_, {fileID}) => getOTP(fileID)),
  },
  Mutation: {
    updateFile: requiresLogin((_, {fileID, filename, isPublic}) => updateFile({fileID, filename, isPublic})),
    // register: (_, {username, password}) => createUser(username, password),
    deleteFile: requiresLogin((_, {fileID}) => yeetFile(fileID)),
    singleUpload: requiresLogin(async (_, args, ctx) => {
      const { createReadStream, filename, mimetype, encoding } = await args.file;
      const stream = createReadStream();
      await storeFS({stream, filename});
      return { filename, mimetype, encoding };
    }),
  },
};

module.exports = resolvers;