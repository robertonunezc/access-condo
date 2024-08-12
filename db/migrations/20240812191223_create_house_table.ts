import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('houses', (table) => {
        table.increments('id').primary();
        table.string('address').notNullable();
        table.integer('owner_id').unsigned().notNullable();
        table.foreign('owner_id').references('id').inTable('users');
        table.integer('condo_id').unsigned().notNullable();
        table.foreign('condo_id').references('id').inTable('condos');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());

    }); 
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('houses');
}

