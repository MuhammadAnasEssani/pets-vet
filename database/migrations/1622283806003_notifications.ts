import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Notifications extends BaseSchema {
    protected tableName = 'notifications'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').notNullable().unsigned();
            table.integer('notifiable_id').unsigned()
            table.string('title').notNullable()
            table.text('message')
            table.integer('ref_id')
            table.integer('type')
            table.timestamp('read_at')
            table.string('extra')
            table.timestamps(true,true)
            table.timestamp('deleted_at', { useTz: true }).nullable().defaultTo(null)
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
