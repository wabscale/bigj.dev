'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'OTPs',
      'downloadTime',
      Sequelize.TIME
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'OTPs',
      'downloadTime'
    );
  }
};
