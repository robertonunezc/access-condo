import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable().unique();
        table.string('phone').notNullable();
        table.string('type').notNullable().defaultTo('USER');
        table.string('username').notNullable();
        table.string('password').notNullable();
        table.string('token').notNullable();
        table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
        table.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now());
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('users');
}





