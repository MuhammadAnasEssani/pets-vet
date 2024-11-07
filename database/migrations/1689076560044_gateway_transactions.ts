import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'gateway_transactions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('transaction_id').notNullable().unsigned()
      table
        .foreign('transaction_id')
        .references('transactions.id')
        .onUpdate('cascade')
        .onDelete('cascade')
      table.string('gateway_transaction_id').notNullable()
      table.string('payment_method_id').nullable()
      table.text('response_object').notNullable()

      table.timestamps(true, true)
      table.timestamp('deleted_at', {useTz: true}).nullable().defaultTo(null)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
