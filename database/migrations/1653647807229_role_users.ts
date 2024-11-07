import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RoleUsers extends BaseSchema {
  protected tableName = 'role_user'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id').unsigned()
      table.foreign('user_id')
        .references('users.id')
        .onUpdate('Cascade')
        .onDelete('Cascade')
      table.integer('role_id').unsigned().notNullable()
      table.foreign('role_id')
        .references('roles.id')
        .onUpdate('Cascade')
        .onDelete('Cascade')

    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
