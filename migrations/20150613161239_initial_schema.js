
exports.up = function (knex) {
  return knex.schema
    .createTable('Drunkard', function (table) {
      table.bigincrements('id').primary();
      table.string('name', 32).notNullable().unique();
      table.enum('sex', ['penis', 'vagina']).notNullable();
      table.integer('bodyWeightKilograms').unsigned().notNullable();
      table.integer('idealDrunkennessLow').unsigned().notNullable().defaultTo(10); // 1 promille
      table.integer('idealDrunkennessHigh').unsigned().notNullable().defaultTo(15); // 1.5 promilles
    })
    .createTable('Drink', function (table) {
      table.bigincrements('id').primary();
      table.string('name', 32).notNullable().unique();
      table.integer('ethanolGrams').unsigned().notNullable();
      // TODO pics etc
    })
    .createTable('Drank', function (table) {
      table.bigincrements('id').primary();
      table.biginteger('drunkardId').unsigned().references('id').inTable('Drunkard');
      table.biginteger('drinkId').unsigned().references('id').inTable('Drink');
      table.dateTime('dateTime').notNullable()
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('Drank')
    .dropTableIfExists('Drink')
    .dropTableIfExists('Drunkard');
};
