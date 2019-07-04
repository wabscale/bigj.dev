const fs = require('fs');
const path = require('path');
const {generateToken} = require('../auth');
const {AuthenticationError} = require('apollo-server-koa');
const {UPLOAD_PATH, DOMAIN} = require('../config');
const {
  getFiles,
  addUser,
  updateFile,
  getDownloadHistory,
  getOTP,
  getFileById,
  deleteFileById,
  addFile
} = require('../db');

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
  fs.unlinkSync(`${UPLOAD_PATH}/${file.filename}`);
  await deleteFileById(id);
  return fileReducer(file);
};

const storeFS = ({stream, filename}) => {
  const path = `${UPLOAD_PATH}/${filename}`;
  return new Promise((resolve, reject) =>
    stream
      .on('error', error => {
        if (stream.truncated)
        // Delete the truncated file.
          fs.unlinkSync(path);
        reject(error);
      })
      .pipe(fs.createWriteStream(path))
      .on('error', error => reject(error))
      .on('finish', () => resolve({path}))
  );
};

handleUpload = async (file) => {
  const {createReadStream, filename, mimetype, encoding} = await file;
  const stream = createReadStream();
  await storeFS({stream, filename});
  await addFile({filename});
  return {filename, mimetype, encoding};
};

transformDownloadHistory = async (records) => (
  (await records).map(({ipAddress, createdAt, allowed}) => ({ipAddress, time: createdAt, allowed}))
);

const handleFileUpdate = async file => {
  console.log('sanity check');
  const currentFile = await getFileById(file.fileID);
  if (currentFile) {
    await updateFile(file);
    if (currentFile.filename !== file.filename) {
      fs.renameSync(path.join(UPLOAD_PATH, currentFile.filename), path.join(UPLOAD_PATH, file.filename));
    }
    return file;
  }
};

const resolvers = {
  Query: {
    files: requiresLogin(() => getAllFiles()),
    file: requiresLogin((_, {fileID}) => getFile(fileID)),
    me: requiresLogin((_, __, ctx) => ({
      username: ctx.state.user ? ctx.state.user.username : '',
    })),
    login: (_, {username, password}) => ({token: generateToken(username, password)}),
    fileHistory: requiresLogin((_, {fileID}) => transformDownloadHistory(getDownloadHistory(fileID))),
    getOTP: requiresLogin((_, {fileID}) => getOTP(fileID)),
  },
  Mutation: {
    updateFile: requiresLogin((_, {fileID, filename, isPublic}) => handleFileUpdate({fileID, filename, isPublic})),
    // register: (_, {username, password}) => createUser(username, password),
    deleteFile: requiresLogin((_, {fileID}) => yeetFile(fileID)),
    singleUpload: requiresLogin(async (_, {file}) => handleUpload(file)),
  },
};

module.exports = resolvers;
