import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'vet_specializations'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('user_id')
      table.dropColumn('user_id');
    });

    this.schema.alterTable(this.tableName, (table) => {
      table.integer('user_detail_id').unsigned().notNullable()
      table.foreign('user_detail_id')
        .references('user_details.id')
        .onUpdate('Cascade')
        .onDelete('Cascade')
    })
  }
}
