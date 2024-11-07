import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddDurationInAttachments extends BaseSchema {
    protected tableName = 'add_duration_in_attachments'

    public async up () {
        this.schema.alterTable('attachments', (table) => {
            table.decimal('duration')
        })
    }

}
