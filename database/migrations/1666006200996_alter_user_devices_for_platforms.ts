import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'user_devices'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('platform', 50)
    })
  }
}
