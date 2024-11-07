import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'appointments'

  public async up() {

    this.schema.alterTable(this.tableName, (table) => {
      table.decimal('admin_cut').unsigned().notNullable().defaultTo(0)
    })
  }
}
