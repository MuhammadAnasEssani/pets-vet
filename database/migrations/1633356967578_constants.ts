import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Constants extends BaseSchema {
    protected tableName = 'constants'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').notNullable().unsigned();
            table.string('name');
            table.string('value');
            table.integer('is_active');
            table.timestamps(true,true)
            table.timestamp('deleted_at', { useTz: true }).nullable().defaultTo(null)
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
