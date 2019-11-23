'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn(
          'Configs',
          'visible',
          Sequelize.BOOLEAN,
          { transaction: t }
        ),
        queryInterface.addConstraint(
          'Configs',
          ['key'],
          {
            type: 'unique',
            name: 'unique_config_key'
          },
          { transaction: t }
        )
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
     */
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn(
          'Configs',
          'visible',
          { transaction: t }
        ),
        queryInterface.removeConstraint(
          'Configs',
          'unique_config_key',
          { transaction: t }
        )
      ]);
    });
  }
};
