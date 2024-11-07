import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Countries extends BaseSchema {
  protected tableName = 'countries'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().unsigned();
      table.string('name');
      table.integer('is_active');
      table.timestamps(true,true)
      table.timestamp('deleted_at', { useTz: true }).nullable().defaultTo(null)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
