import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('condos', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('address').notNullable();
        table.integer('manager_id').unsigned().notNullable();
        table.foreign('manager_id').references('id').inTable('users');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    })
}



export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('condos');
}

