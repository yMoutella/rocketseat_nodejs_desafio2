import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('meal', (table) => {
        table.uuid('meal_id').primary().notNullable()
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('meal', (table) => {
        table.dropColumn('meal_id');
    });
}

