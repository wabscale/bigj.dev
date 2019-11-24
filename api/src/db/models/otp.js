'use strict';
module.exports = (sequelize, DataTypes) => {
  const OTP = sequelize.define('OTP', {
    fileID: DataTypes.INTEGER,
    otp: DataTypes.STRING,
    downloadTime: DataTypes.DATE,
    timeout: DataTypes.INTEGER,
  }, {});
  OTP.associate = function(models) {
    // associations can be defined here
  };
  return OTP;
};