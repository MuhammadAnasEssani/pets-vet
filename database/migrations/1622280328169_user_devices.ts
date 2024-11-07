import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserDevices extends BaseSchema {
    protected tableName = 'user_devices'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').notNullable().unsigned();
            table.integer('user_id').unsigned()
            table.foreign('user_id').references('users.id').onUpdate('Cascade').onDelete('Cascade')
            table.string('device_type')
            table.string('device_token')
            table.integer('push_notification')
            table.timestamps(true,true)
            table.timestamp('deleted_at', { useTz: true }).nullable().defaultTo(null)
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
