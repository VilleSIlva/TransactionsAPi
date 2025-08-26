import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("transactions",(table)=>{
        table.uuid('id').primary().notNullable(),
        table.text('title').notNullable(),
        table.decimal('amount',10,2).notNullable(),
        table.uuid('session_id').index(),
        table.string('payments').defaultTo('debit')
        table.timestamp('created_at').defaultTo(knex.fn.now())
    
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('transactions');
}

