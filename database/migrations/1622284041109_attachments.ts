import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Attachments extends BaseSchema {
    protected tableName = 'attachments'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').notNullable().unsigned();
            table.string('path')
            table.integer('instance_type').notNullable()
            table.integer('instance_id').notNullable()
            table.string('mime_type')
            table.string('thumbnail')
            table.timestamps(true,true)
            table.timestamp('deleted_at', { useTz: true }).nullable().defaultTo(null)
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
