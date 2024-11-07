import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'schedules'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('vet_id').unsigned().notNullable()
      table.foreign('vet_id')
        .references('users.id')
        .onUpdate('Cascade')
        .onDelete('Cascade')
      table.date('date').notNullable()

      table.timestamps(true, true)
      table.timestamp('deleted_at', {useTz: true}).nullable().defaultTo(null)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
