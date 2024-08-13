import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('appointments', (table) => {
        table.increments('id').primary();
        table.string('personName').notNullable();
        table.string('carPlate').notNullable();
        table.date('scheduledDate').notNullable();
        table.string('status').notNullable().defaultTo('CREATED');
        table.string('personPhysicalId').nullable();
        table.string('shareLink').nullable();
        table.dateTime('inDateTime').nullable();
        table.dateTime('outDateTime').nullable();
        table.integer('house_id').unsigned().notNullable();
        table.foreign('house_id').references('id').inTable('houses');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('appointments');
}

