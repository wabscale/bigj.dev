const db = require('../models');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const {DOMAIN} = require('../../config.js');
const validators = require('./validators');

module.exports = {
  // get
  getFiles: () => (
    /**
     * This function will get all the current files from the database.
     * The File table should be kept in sync with the filesystem with
     * the middleware specified in src/graphql/files.js
     */
    db.File.findAll()
  ),
  getFileById: id => (
    /**
     * This gets a single row for a File by specified File.id.
     */
    db.File.findOne({where: {id,}})
  ),
  getFileByFilename: filename => (
    /**
     * This will get a single row for a file by filename. Now
     * that there is a unique constraint on File.filename in
     * the database, you are guaranteed that if the file exists,
     * this function will return its one and only row.
     */
    db.File.findOne({where: {filename,}})
  ),
  getUserById: id => (
    /**
     * This will get a User row by User.id.
     */
    db.User.findOne({where: {id,}})
  ),
  getUserByUsername: username => (
    /**
     * This will get a User row by User.username.
     */
    db.User.findOne({where: {username,}})
  ),
  getConfig: key => (
    /**
     * This will get a Config row by Config.key.
     */
    db.Config.findOne({where: {key,}})
  ),
  getAllVisibleConfig: () => (
    /**
     * All config rows have a boolean value (Config.visible) that
     * specifies whether or not users should be able to see and modify
     * that row. This function will get all rows in the config table
     * that the user should have access to (read and write).
     */
    db.Config.findAll({where: {visible: true}})
  ),
  getVisibleConfig: key => (
    /**
     * This will get a Config row by key. Since this used by the graphql api,
     * there is an extra constraint on the row being visible.
     */
    db.Config.findOne({where: {visible: true, key}})
  ),
  getDownloadHistory: (fileID) => (
    /**
     * This will get the full download history for a given file by File.id.
     */
    db.DownloadHistory.findAll({
      where: {fileID},
      attributes: ['ipAddress', 'createdAt', 'allowed']
    })
  ),

  // add
  addFile: ({filename, isPublic = false, size = null}) => (
    /**
     * This will create a file in the database. It will rely on the graphql filesystem
     * synchronization middleware for the data to be accurate.
     *
     * The isPublic param should be based on the value of the defaultPermission config row.
     * It should also be fine if the size is not specified at the time of file creation. The
     * filesystem synchronization middleware will handle updating file sizes as needed.
     */
    db.File.create({filename, isPublic, size})
  ),
  addOTP: async (fileID) => {
    /**
     * This function will create an OTP for a given File.id. If the file does not exist,
     * it will return null, causing a graphql schema error. The newly created OTP will
     * not have a timeout specified, and will therefore be unlimited. To add a timeout
     * to an OTP, use the webui.
     */
    const otp = crypto.randomBytes(8).toString('hex');
    const file = await db.File.findOne({where: {id: fileID}});
    if (!file)
      return null;
    await db.OTP.create({otp, fileID});
    return {
      otp: `https://${DOMAIN}/f/${file.filename}?otp=${otp}`,
      rawOtp: otp,
    };
  },
  addUser: (username, password) => (
    /**
     * This adds a new User to the Users table.
     */
    db.User.create({username, password: bcrypt.hashSync(password, 10)})
  ),
  addConfig: (key, value) => (
    /**
     * This adds a new config value to the Config table.
     */
    db.Config.create({key, value})
  ),
  addDownload: (fileID, ipAddress, allowed) => (
    /**
     * This will be called every time there a download is attempted.
     * It adds a new DownloadHistory to the database.
     */
    db.DownloadHistory.create({fileID, ipAddress, allowed})
  ),

  // delete
  deleteFileByFilename: ({filename}) => (
    /**
     * This deletes a File row from the database by file.filename.
     */
    db.File.destroy({where: {filename,}})
  ),
  deleteFileById: id => (
    /**
     * This deletes a File row from the database by File.id.
     */
    db.File.destroy({where: {id,}})
  ),

  // update
  updateFile: async (file) => {
    /**
     * This will update a file row with new field information. These changes
     * can be a filename change, or a isPublic change.
     */
    await db.File.update({...file}, {where: {id: file.fileID}});
    return file;
  },
  updateConfig: async (keys, values) => {
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
