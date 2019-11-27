const fs = require('fs');
const path = require('path');
const {addFile, getFiles, deleteFileByFilename, getConfig} = require('../db');
const {UPLOAD_PATH} = require('../config.js');

function difference(setA, setB) {
  let _difference = new Set(setA);
  for (let elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}

truncateDecimals = function (number, digits) {
  let multiplier = Math.pow(10, digits),
    adjustedNum = number * multiplier,
    truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);
  return truncatedNum / multiplier;
};

getFileSize = (filename) => {
  return fs.statSync(filename).size;
};

const update = async (ctx, next) => {
  /*
  This function should check to see if there are new files in the UPLOAD_PATH,
  and update the database accordingly. The default permission (public/private) for
  the file should be specified through the defaultPermission user config.
   */

  // Convert filesystem files, and database entries to sets of filenames
  const fsFilenames = new Set(fs.readdirSync(UPLOAD_PATH));
  const dbFilename = new Set((await getFiles()).map(file => file.filename));

  // Figure out which are new and which have been deleted
  const newFiles = difference(fsFilenames, dbFilename);
  const deletedFiles = difference(dbFilename, fsFilenames);

  // Get the default isPublic value
  const defaultPermission = await getConfig('defaultPermission');
  const isPublic = defaultPermission.value === '1';

  // Handle deleting rows for removed files and creating rows for new files
  deletedFiles.forEach(filename => deleteFileByFilename({filename}));
  newFiles.forEach(filename => addFile({
    filename,
    isPublic,
    size: getFileSize(`${UPLOAD_PATH}/${filename}`),
  }));

  let files = await getFiles();
  files.forEach(file => {
    // Record size of file (in bytes) for each row.
    file.size = getFileSize(`${UPLOAD_PATH}/${file.filename}`);

    // This save will only run an update query if the value of size was changed.
    file.save();
  });

  await next();
};


module.exports = {
  update,
};
