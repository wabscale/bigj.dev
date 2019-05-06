const Knex = require('knex');
const knexfile = require('../../knexfile');

const knex = Knex(knexfile.development);

module.exports = knex;
