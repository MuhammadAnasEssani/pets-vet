import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'


export default class MessageNotificationValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    users: schema.array.optional().members(
      schema.number([
        rules.exists({
          table: 'users',
          column: 'id',
          where: {
            is_verified: true,
            deleted_at: null,
          },
        }),
        rules.unsigned(),
      ])
    ),
    title: schema.string([rules.trim(), rules.maxLength(255)]),
    body: schema.string([rules.trim(), rules.maxLength(255)]),
  })
}
