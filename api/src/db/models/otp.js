'use strict';
module.exports = (sequelize, DataTypes) => {
  const OTP = sequelize.define('OTP', {
    fileID: DataTypes.INTEGER,
    otp: DataTypes.STRING
  }, {});
  OTP.associate = function(models) {
    // associations can be defined here
  };
  return OTP;
};