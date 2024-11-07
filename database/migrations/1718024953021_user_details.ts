import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'user_details'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('vet_type').unsigned().notNullable()
      table.string('state_license_number', 255).notNullable();
      table.string('state_license', 255).notNullable();
      table.string('national_license_number', 255)
      table.string('dea_number', 255)
      table.string('reg_number', 255)
      table.string('about', 255)
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
