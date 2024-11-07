import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'cards'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable()
      table.foreign('user_id').references('users.id').onUpdate('cascade').onDelete('cascade')
      table.string('stripe_card_id').notNullable()
      table.string('brand').notNullable()
      table.string('last4').notNullable()
      table.boolean('is_active').defaultTo(false)

      table.timestamps(true, true)
      table.timestamp('deleted_at', {useTz: true}).nullable().defaultTo(null)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
