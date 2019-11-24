'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'OTPs',
      'downloadTime',
      Sequelize.DATE
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'OTPs',
      'downloadTime'
    );
  }
};
