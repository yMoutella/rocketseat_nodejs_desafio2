import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meal', (table) => {
    table.text('name').notNullable();
    table.text('description').notNullable();
    table.string('meal_timestamp').notNullable();
    table.boolean('diet').notNullable().defaultTo(false);
    table.string('user_id').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.foreign('user_id').references('id').inTable('user').onDelete('CASCADE');
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('meal');
}

