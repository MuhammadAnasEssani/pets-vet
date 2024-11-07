import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'user_addresses'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.float('latitude', 20, 2).notNullable()
      table.float('longitude', 20, 2).notNullable()
      table.boolean("is_default").defaultTo(false);
      table.integer('user_id').unsigned().notNullable()
      table.foreign('user_id')
        .references('users.id')
        .onUpdate('Cascade')
        .onDelete('Cascade')

      table.timestamps(true, true)
      table.timestamp('deleted_at', {useTz: true}).nullable().defaultTo(null)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
