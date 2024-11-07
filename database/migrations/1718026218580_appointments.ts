import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'appointments'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.decimal('amount').unsigned().notNullable()
      table.integer('status').unsigned().notNullable().defaultTo(10)
      table.string('reason', 255).notNullable();
      table.time('start_time').notNullable()
      table.time('end_time').notNullable()
      table.date('appointment_date').notNullable()
      table.integer('duration').unsigned().notNullable()
      table.boolean("emergencyCase").defaultTo(false);
      table.integer('appointment_id').unsigned()
      table.foreign('appointment_id')
        .references('appointments.id')
        .onUpdate('Cascade')
        .onDelete('Cascade')
      table.integer('pet_id').unsigned().notNullable()
      table.foreign('pet_id')
        .references('pets.id')
        .onUpdate('Cascade')
        .onDelete('Cascade')
      table.integer('user_id').unsigned().notNullable()
      table.foreign('user_id')
        .references('users.id')
        .onUpdate('Cascade')
        .onDelete('Cascade')
      table.integer('vet_id').unsigned().notNullable()
      table.foreign('vet_id')
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
