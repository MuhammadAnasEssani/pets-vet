import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RolePermissions extends BaseSchema {
  protected tableName = 'role_permissions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned().notNullable()
      table.integer('role_id').unsigned().notNullable()
      table.foreign('role_id')
        .references('roles.id')
        .onUpdate('cascade')
        .onDelete('cascade')
      table.integer('module_id').unsigned().notNullable()
      table.foreign('module_id')
        .references('modules.id')
        .onUpdate('cascade')
        .onDelete('cascade')
      table.boolean('create')
      table.boolean('read')
      table.boolean('update')
      table.boolean('delete')
      table.timestamps(true, true)
      table.timestamp('deleted_at', {useTz: true}).nullable().defaultTo(null)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
