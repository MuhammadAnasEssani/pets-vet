import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'user_addresses'

  public async up() {

    this.schema.alterTable(this.tableName, (table) => {
      table.string('address', 255).notNullable();
      table.string('city', 255).notNullable();
    })
  }
}
