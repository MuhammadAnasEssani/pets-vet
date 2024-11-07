import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'contacts'

  public async up() {

    this.schema.alterTable(this.tableName, (table) => {
      table.text('description').alter()
      table.string('reason').notNullable()
    })
  }
}
