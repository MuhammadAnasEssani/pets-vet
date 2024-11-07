import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned().notNullable()
      table.integer('ref_id').unsigned().notNullable()
      table.integer('ref_type').unsigned().notNullable()
      table.decimal('amount').unsigned().notNullable()

      table.foreign('user_id').references('users.id').onUpdate('cascade').onDelete('cascade')
      table.timestamps(true, true)
      table.timestamp('deleted_at', {useTz: true}).nullable().defaultTo(null)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
