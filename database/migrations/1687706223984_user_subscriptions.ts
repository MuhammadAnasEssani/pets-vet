import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'user_subscriptions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('plan_id').notNullable().unsigned()
      table.foreign('plan_id').references('plans.id').onUpdate('cascade').onDelete('cascade')
      table.timestamp('subscription_start_date')
      table.timestamp('subscription_next_payment')
      table.boolean('subscription_payment_failed').defaultTo(false)
      table.string('subscription_id')
      table.integer('user_id').unsigned().notNullable()
      table.foreign('user_id')
        .references('users.id')
        .onUpdate('Cascade')
        .onDelete('Cascade')

      table.timestamps(true, true)
      table.timestamp('deleted_at', {useTz: true}).nullable().defaultTo(null)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
