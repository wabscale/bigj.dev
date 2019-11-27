'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.addConstraint(
      'Files',
      ['filename'],
      {
        type: 'unique',
        name: 'unique_filenames'
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
     */
    return queryInterface.removeConstraint(
      'Files',
      'unique_filenames'
    )
  }
};
