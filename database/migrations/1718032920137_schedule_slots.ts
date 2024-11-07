import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'schedule_slots'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('schedule_id').unsigned().notNullable()
      table.foreign('schedule_id')
        .references('schedules.id')
        .onUpdate('Cascade')
        .onDelete('Cascade')
      table.integer('slot_id').unsigned().notNullable()
      table.foreign('slot_id')
        .references('slots.id')
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
