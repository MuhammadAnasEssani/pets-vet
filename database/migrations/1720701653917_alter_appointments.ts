import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'appointments'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('payout_status').unsigned().notNullable().defaultTo(10);
    })
  }
}
