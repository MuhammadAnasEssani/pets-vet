import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SocialAccounts extends BaseSchema {
    protected tableName = 'social_accounts'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').notNullable().unsigned();
            table.integer('user_id').unsigned().notNullable()
            table.foreign('user_id').references('users.id').onDelete('Cascade').onUpdate('Cascade')
            table.string('platform',25)
            table.string('client_id',200)
            table.timestamp('expired_at')
            table.integer('status')
            table.timestamps(true,true)
            table.timestamp('deleted_at', { useTz: true }).nullable().defaultTo(null)
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
