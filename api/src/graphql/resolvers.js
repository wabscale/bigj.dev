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
  addOTP,
  getFileById,
  deleteFileById,
  addFile,
  getAllVisibleConfig,
  getVisibleConfig,
  updateConfig,
  updateOTP
} = require('../db');

const requiresLogin = resolver => (parent, args, ctx, info) => {
  /*
  This function should be used to wrap any resolver that should be
  locked behind authentication. It checks that there was a user loaded
  (logic for this in api/src/auth.js) and either calls the resolver accordingly
  or throws an authentication error.
   */
  if (ctx.state.user)
    return resolver(parent, args, ctx, info);
  throw new AuthenticationError('Unauthorized');
};

fileReducer = (file) => ({
  /*
  This reducer handles renaming and reducing fields for the file type.
   */
  fileID: file.id,
  filename: file.filename,
  isPublic: file.isPublic,
  size: file.size,
});

getAllFiles = async () => {
  /*
  This function will fetch all files (public and private), then run their
  rows through the file reducer.
   */
  const response = await getFiles();
  return response.map(file => fileReducer(file));
};

getFile = async (fileID) => {
  /*
  This function gets the row for a file, then returns its reduced form.
  It is used to get information about a file by fileID in the webui.
   */
  const response = await getFileById(fileID);
  return response !== null ? fileReducer(response) : null;
};

getFilesById = ({fileIDs}) => {
  /*
  This does what it says it does. Takes and array of fileIDs, the gives
  back promises for their corresponding rows.
   */
  return Promise.all(
    fileIDs.map(fileID => getFileById(fileID)),
  );
};

createUser = async (username, password) => {
  /*
  Handles new user creation. This is not currently accssable through the webui.
  In the future I hope to add users and permissions.
   */
  try {
    await addUser(username, password);
    return {token: generateToken(username, password)};
  } catch (e) {
    return {token: ''};
  }
};

yeetFile = async (id) => {
  /*
  This function will handle yeeting a file by database fileID (id).
  It deletes the file on the filesystem, then the row in tha database.
   */
  const file = await getFileById(id);
  if (file) {
    fs.unlinkSync(path.join(UPLOAD_PATH, file.filename));
    await deleteFileById(id);
    return fileReducer(file);
  }
};

const storeFS = ({stream, filename}) => {
  /*
  This function takes a stream (from a graphql Upload object) and
  saves it to a filename. I expect much of the functions used here
  to be deprecated, as javascripts js module has high turnover.
   */
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
  /*
  This function takes a raw graphql Upload object (file) and
  saves it to the filesystem, then the database. The most
  important thing this function returns is the fileID for
  the new row in the database.
   */
  const {createReadStream, filename, mimetype, encoding} = await file;
  const stream = await createReadStream();
  await storeFS({stream, filename});
  const fileID = (await addFile({filename})).id;
  return {fileID, filename, mimetype, encoding};
};

transformDownloadHistory = async (records) => (
  /*
  This is a simple field renaming transform for convenience.
   */
  (await records).map(({ipAddress, createdAt, allowed}) => ({ipAddress, time: createdAt, allowed}))
);

const handleFileUpdate = async file => {
  /*
  This function will be called when you click on the save icon in the webui.
  It should handle renaming the specified file (if necessary).
   */
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
    files: requiresLogin(getAllFiles),
    file: requiresLogin((_, {fileID}) => getFile(fileID)),
    me: requiresLogin((_, __, ctx) => ({username: ctx.state.user.username})),
    login: (_, {username, password}) => ({token: generateToken(username, password)}),
    fileHistory: requiresLogin((_, {fileID}) => transformDownloadHistory(getDownloadHistory(fileID))),
    getOTP: requiresLogin((_, {fileID}) => addOTP(fileID)),
    getAllConfig: requiresLogin(getAllVisibleConfig),
    getConfig: requiresLogin((_, {key}) => getVisibleConfig(key))
  },
  Mutation: {
    updateFile: requiresLogin((_, {fileID, filename, isPublic}) => handleFileUpdate({fileID, filename, isPublic})),
    // register: (_, {username, password}) => createUser(username, password),
    deleteFile: requiresLogin((_, {fileID}) => yeetFile(fileID)),
    singleUpload: requiresLogin((_, {file}) => handleUpload(file)),
    updateConfig: requiresLogin((_, {keys, values}) => updateConfig(keys, values)),
    updateOTP: requiresLogin((_, {otp, timeout}) => updateOTP(otp, timeout))
  },
};

module.exports = resolvers;
