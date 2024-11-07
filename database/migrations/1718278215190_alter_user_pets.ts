import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'user_pets'

  public async up() {


    this.schema.alterTable(this.tableName, (table) => {
      table.integer('breed_id').unsigned().nullable().alter()
      table.string('breed', 255)

    })
  }
}
