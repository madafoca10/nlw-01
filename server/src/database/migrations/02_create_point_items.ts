import Knex from 'knex';

export async function up(knex:Knex) {
    return knex.schema.createTable('points_items', table => {
        table.increments('id').primary();
        table.integer('id_points')
            .notNullable()
            .references('id')
            .inTable('points');
        table.integer('id_items')
            .notNullable()
            .references('id')
            .inTable('items');
    });
}

export async function down(knex:Knex) {
    return knex.schema.dropTable('points_items');
}