import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'cards'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('stripe_card_id');
    });

    this.schema.alterTable(this.tableName, (table) => {
      table.string('payment_method_id').notNullable()
    })
  }
}
