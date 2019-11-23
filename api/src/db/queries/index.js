const db = require('../models');
const bcrypt = require('bcryptjs');
var crypto = require("crypto");
const {DOMAIN} = require('../../config.js');
const validators = require('./validators');

module.exports = {
  // get
  getFiles: async () => await db.File.findAll(),
  getFileById: async id => {
    let files = await db.File.findAll({where: {id,}});
    return files.length === 1 ? files[0] : null;
  },
  getFileByFilename: async filename => {
    let files = await db.File.findAll({where: {filename,}});
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
    return values.length >= 1 ? values[0] : null;
  },
  getVisibleConfig: () => (
    db.Config.findAll({where: {visible: true}})
  ),
  getDownloadHistory: async (fileID) => (
    await db.DownloadHistory.findAll({
      where: {fileID},
      attributes: ['ipAddress', 'createdAt', 'allowed']
    })
  ),
  getOTP: async (fileID) => {
    const otp = crypto.randomBytes(8).toString('hex');
    const file = await db.File.findAll({where: {id: fileID}});
    await db.OTP.create({otp, fileID});
    return {
      otp: `${DOMAIN}/f/${file[0].filename}?otp=${otp}`,
    };
  },

  // add
  addFile: async ({filename, isPublic = false, size = null}) => (
    await db.File.create({filename, isPublic, size})
  ),
  addUser: async (username, password) => (
    await db.User.create({username, password: bcrypt.hashSync(password, 10)})
  ),
  addConfig: (key, value) => db.Config.create({key, value}),
  addDownload: (fileID, ipAddress, allowed) => db.DownloadHistory.create({fileID, ipAddress, allowed}),

  // delete
  deleteFileByFilename: async ({filename}) => (
    await db.File.destroy({where: {filename,}})
  ),
  deleteFileById: async (id) => (
    await db.File.destroy({where: {id,}})
  ),

  // update
  updateFile: async (file) => {
    await db.File.update({...file}, {where: {id: file.fileID}});
    return file;
  },
  updateSettings: async (keys, values) => {
    /*
    This function will take key, value arrays for settings, and update accordingly.
    For each mutable config key, there should be a corresponding validation
    function in ./validation.js. The config row must also have visible to be true
    in order for the user to mutate the row. This function will return any errors
    from failing to update rows.
     */
    const errors = [];
    const zip = (keys, values) => keys.map((key, index) => ({key, value: values[index]}));
    for (const obj of zip(keys, values)) {
      const {key, value} = obj;
      const current = await db.Config.findOne({where: {key,}});
      if (!(current && current.visible && validators[key](value))) {
        errors.push({
          message: 'Failed to update ' + key,
        });
      }
      current.value = value;
      current.save();
    }
    return errors;
  },

  // verify
  verifyOtp: async (userOTP, file) => {
    /*
    This function should be called anytime a download request is seen that
    specifies a otp. It should verify that the otp exists for the given file,
    then check to make sure this request is within the timeout limit.

    If we are enforcing the otp timeout, the clock starts after the first time
    the otp is used.
     */
    if (!userOTP) return false;
    const otp = await db.OTP.findOne({
      where: {
        otp: userOTP,
        fileID: file.id,
      }
    });

    if (!otp) {
      return false;
    }

    // We will want to enforce otp timeout if settings permit.
    const otpTimeout = Number(await db.Config.findOne({
      where: {
        key: 'otpTimeout',
      }
    }));

    /*
    If usersetting otpTimeout is greater than 0, then we want to enforce
    the timeout. Otherwise, the otp will be good forever.
     */
    if (otpTimeout > 0) {
      if (!otp.downloadTime) {
        otp.downloadTime = new Date().getTime();
        otp.save();
      }
      return otp.downloadTime + otpTimeout * 60 > new Date().getTime();
    }

    return !!otp;
  }
};
