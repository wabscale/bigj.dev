'use strict';

const crypto = require('crypto');

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
     */
    return queryInterface.bulkInsert('Configs', [{
      key: 'siteKey',
      value: crypto.randomBytes(32).toString('hex'),
      valueType: 'string',
      visible: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      key: 'defaultPermission',
      value: '0',
      valueType: 'boolean',
      visible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      key: 'siteTitle',
      value: 'f.bigj.dev',
      valueType: 'string',
      visible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Configs', null, {});
  }
};
