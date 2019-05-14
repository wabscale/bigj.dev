'use strict';
module.exports = (sequelize, DataTypes) => {
  const DownloadHistory = sequelize.define('DownloadHistory', {
    fileID: DataTypes.INTEGER,
    ipAddress: DataTypes.STRING,
    time: DataTypes.TIME,
    allowed: DataTypes.BOOLEAN,
  }, {});
  DownloadHistory.associate = function(models) {
    // associations can be defined here
    const {File} = models;
    File.hasMany(DownloadHistory);
    DownloadHistory.belongsTo(File, {
      as: 'download',
      foreignKey: 'fileID',
    })
  };
  return DownloadHistory;
};
