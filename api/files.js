const fs = require('fs');
const path = require('path');
const {addFile, getFiles, deleteFileByFilename} = require('../db');
const {uploadPath} = require('../config.js');

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

function humanSize(nbytes) {
  let suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let i = 0;
  let f = `${nbytes}`;
  while (nbytes >= 1024 && i < suffixes.length - 1) {
    nbytes /= 1024;
    ++i;
    f = truncateDecimals(nbytes, 2);
  }
  return `${nbytes} ${suffixes[i]}`;
};

getFileSize = (filename) => {
  return fs.statSync(filename).size;
};

const update = async (ctx, next) => {
  const fsFilenames = new Set(fs.readdirSync(uploadPath));
  const dbFilename = new Set((await getFiles()).map(file => file.filename));

  const newFiles = difference(fsFilenames, dbFilename);
  const deletedFiles = difference(dbFilename, fsFilenames);

  deletedFiles.forEach(filename => deleteFileByFilename({filename}));
  newFiles.forEach(filename => addFile({
    filename,
    size: getFileSize(`${uploadPath}/${filename}`),
  }));

  let files = await getFiles();
  files.forEach(file => {
    file.size = getFileSize(`${uploadPath}/${file.filename}`);
    file.save();
  });

  await next();
};


module.exports = {
  update,
  humanSize,
};
