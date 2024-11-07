import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().unsigned();
      table.string('email').notNullable();
      table.string('password', 255).notNullable();
      table.string('full_name', 255).notNullable();
      table.float('latitude', 20, 2)
      table.float('longitude', 20, 2)
      table.string("verification_code", 10);
      table.boolean("is_verified").defaultTo(false);
      table.boolean("emergency_location").defaultTo(false);
      table.boolean("share_pet_record").defaultTo(false);
      table.boolean("access_pharmacy").defaultTo(false);
      table.string("phone").notNullable()
      table.string("alternate_phone")
      table.boolean("is_completed").defaultTo(false);
      table.string("social_platform")
      table.string("client_id")
      table.string("token")
      table.boolean("is_social_login").defaultTo(false);
      table.boolean("is_approved").defaultTo(false);
      table.timestamp("last_login_at")
      table.timestamps(true, true)
      table.timestamp('deleted_at', {useTz: true}).nullable().defaultTo(null)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
