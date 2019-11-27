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
  getAllVisibleConfig: () => (
    db.Config.findAll({where: {visible: true}})
  ),
  getVisibleConfig: key => (
    db.Config.findOne({where: {visible: true, key}})
  ),
  getDownloadHistory: async (fileID) => (
    await db.DownloadHistory.findAll({
      where: {fileID},
      attributes: ['ipAddress', 'createdAt', 'allowed']
    })
  ),
  getOTP: async (fileID) => {
    const otp = crypto.randomBytes(8).toString('hex');
    const file = await db.File.findOne({where: {id: fileID}});
    await db.OTP.create({otp, fileID});
    return {
      otp: `https://${DOMAIN}/f/${file.filename}?otp=${otp}`,
      rawOtp: otp,
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
  updateOTP: async (otpValue, timeout) => {
    /*
    This should take the specified otp, and update its corresponding timeout value.
    We should return any errors (if any).
     */
    const otp = await db.OTP.findOne({
      where: {
        otp: otpValue
      }
    });

    if (!otp) {
      return {
        message: 'Invalid OTP'
      };
    }

    /*
    We want to be careful to not accidentally update an already expired timeout.
     */
    if (validators.isOTPExpired(otp)) {
      return {
        message: 'Failed to update',
        description: 'OTP already expired'
      };
    }

    // Verify user specified timeout is valid
    if (isNaN(timeout) || timeout < 0) {
      return {
        message: 'Failed to update',
        description: 'OTP already expired'
      };
    }

    // Update timeout and save
    otp.timeout = timeout;
    otp.save();

    // return no errors
    return null;
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

    /*
    If otp.timout is greater than 0, then we want to enforce
    the timeout. Otherwise, the otp will be good forever.
     */
    if (!!otp.timeout && otp.timeout > 0) {
      if (!otp.downloadTime) {
        otp.downloadTime = new Date();
        otp.save();
      }
      return validators.isOTPExpired(otp);
    }

    return !!otp;
  }
};
