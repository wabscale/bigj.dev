'use strict';
module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    filename: DataTypes.STRING,
    isPublic: DataTypes.BOOLEAN,
    size: DataTypes.STRING
  }, {});
  File.associate = function(models) {
    // associations can be defined here
  };
  return File;
};