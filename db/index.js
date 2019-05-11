const queries = require('./queries');

module.exports = {
  ...queries
};


/* const User = sequelize.define('User', {
 *   id: {
 *     type: Sequelize.INTEGER,
 *     autoIncrement: true,
 *     allowNull: false,
 *     primaryKey: true,
 *   },
 *   username: {
 *     type: Sequelize.STRING,
 *     allowNull: false,
 *     unique: 'compositeIndex'
 *   },
 *   password: {
 *     type: Sequelize.STRING
 *     // allowNull defaults to true
 *   },
 * });
 * 
 * const File = sequelize.define('File', {
 *   id: {
 *     type: Sequelize.INTEGER,
 *     autoIncrement: true,
 *     allowNull: false,
 *     primaryKey: true,
 *   },
 *   filename: {
 *     type: Sequelize.STRING,
 *     allowNull: false,
 * 
 *   },
 * }); */
