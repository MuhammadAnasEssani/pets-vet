import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Pages extends BaseSchema {
    protected tableName = 'pages'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').notNullable().unsigned();
            table.string('slug').notNullable()
            table.string('title').notNullable()
            table.text('content')
            table.timestamps(true,true)
            table.timestamp('deleted_at', { useTz: true }).nullable().defaultTo(null)
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
