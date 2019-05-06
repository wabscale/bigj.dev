exports.up = function (knex, Promise) {
  return knex.schema.createTable('User', table => {
    table.increments('id');
    table.string('username').unique().notNullable();
    table.string('password').notNullable();
  }).createTable('File', table => {
    table.increments('id');
    table.string('filename').unique().notNullable();
    table.boolean('public').defaultTo(false);
    table.timestamp('creationTime').notNullable().defaultTo(knex.fn.now());
  }).createTable('OTP', table => {
    table.increments('id');
    table.integer('fileId').references('File.id');
    table.string('otp').unique().notNullable();
    table.dateTime('startTime').defaultTo(null);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable(
    'User'
  ).dropTable(
    'File'
  ).dropTable(
    'OTP'
  );
};
