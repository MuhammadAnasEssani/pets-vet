import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'schedule_slot_times'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('schedule_slot_id').unsigned().notNullable()
      table.foreign('schedule_slot_id')
        .references('schedule_slots.id')
        .onUpdate('Cascade')
        .onDelete('Cascade')
      table.time('start_time').notNullable()
      table.time('end_time').notNullable()

      table.timestamps(true, true)
      table.timestamp('deleted_at', {useTz: true}).nullable().defaultTo(null)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
