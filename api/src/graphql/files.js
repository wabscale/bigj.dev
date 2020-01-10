const fs = require('fs');
const path = require('path');
const {addFile, getFiles, deleteFileByFilename, getConfig} = require('../db');
const {UPLOAD_PATH} = require('../config.js');

function difference(setA, setB) {
  /**
   * This is a jank set difference.
   */
  let _difference = new Set(setA);
  for (let elem of setB)
    _difference.delete(elem);
  return _difference;
}

truncateDecimals = (number, digits) => {
  /**
   * This function will truncate off a number so it only has n digits.
   *
   * example:
   * truncateDecimals(1.123456789, 3) => 1.123
   * @type {number}
   */
  let multiplier = Math.pow(10, digits),
    adjustedNum = number * multiplier,
    truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);
  return truncatedNum / multiplier;
};

getFileSize = filename => (
  /**
   * This will get the size of a file on the filesystem by filename in bytes.
   */
  fs.statSync(filename).size
);

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

  /*
  There is a chance for a race condition at this step. If two requests come in at the same time,
  and this part of the chain runs at the same time, then we will get duplicate rows for the same file.
  To avoid this, I've added a unique constraint to the File model.

  In the event that we have two workers running this function, to avoid a nasty 500 we can simply ignore the error
  caused in the database by the unique constraint. This isn't the most grateful solution to this race
  condition, but it will work for now.
   */

  try {
    // Handle deleting rows for removed files and creating rows for new files
    deletedFiles.forEach(filename => deleteFileByFilename({filename}));
    newFiles.forEach(filename => addFile({
      filename,
      isPublic,
      size: getFileSize(`${UPLOAD_PATH}/${filename}`).toString(),
    }));

    let files = await getFiles();
    files.forEach(file => {
      // Record size of file (in bytes) for each row.
      file.size = getFileSize(`${UPLOAD_PATH}/${file.filename}`).toString();

      // This save will only run an update query if the value of size was changed.
      file.save();
    });
  } catch (e) {
    console.error(e, 'Race condition avoided');
  }

  await next();
};


module.exports = {
  update,
};
