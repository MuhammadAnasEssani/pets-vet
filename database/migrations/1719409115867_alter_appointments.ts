import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'appointments'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('pet_id')
      table.dropColumn('pet_id');
    });

    this.schema.alterTable(this.tableName, (table) => {
      table.integer('user_pet_id').unsigned().notNullable()
      table.foreign('user_pet_id')
        .references('user_pets.id')
        .onUpdate('Cascade')
        .onDelete('Cascade')
    })
  }
}
