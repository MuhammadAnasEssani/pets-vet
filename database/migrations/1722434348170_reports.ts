import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'reports'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable()
      table.foreign('user_id').references('users.id').onUpdate('Cascade').onDelete('Cascade')
      table.integer('vet_id').unsigned().notNullable()
      table.foreign('vet_id').references('users.id').onUpdate('Cascade').onDelete('Cascade')
      table.string('reason').notNullable()

      table.timestamps(true, true)
      table.timestamp('deleted_at', {useTz: true}).nullable().defaultTo(null)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
