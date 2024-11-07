import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'user_details'

  public async up() {

    this.schema.alterTable(this.tableName, (table) => {
      table.time('start_time').nullable().alter()
      table.time('end_time').nullable().alter()
    })
  }
}
