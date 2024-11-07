import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'prescriptions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 255).notNullable();
      table.string('dosage', 255).notNullable();
      table.string('instruction', 255);
      table.integer('frequency').unsigned().notNullable()
      table.integer('appointment_id').unsigned().notNullable()
      table.foreign('appointment_id')
        .references('appointments.id')
        .onUpdate('Cascade')
        .onDelete('Cascade')
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
