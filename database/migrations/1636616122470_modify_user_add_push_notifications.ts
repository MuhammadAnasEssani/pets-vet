import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ModifyUserAddPushNotifications extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('push_notification', 1).defaultTo(1).notNullable()
    })
  }
}
