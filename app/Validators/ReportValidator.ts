import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";

export default class ReportValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public refs = schema.refs({
    userId : this.ctx.auth.use('api').user?.id,
  })

  public schema = schema.create({
    reason: schema.string([rules.trim(),rules.maxLength(255),]),
    vet_id: schema.number([
      rules.unsigned(),
      rules.exists({table: 'users', column: 'id',
        where: {
          deleted_at: null,
        },
        whereNot: {
          id: this.refs.userId
        }
      }),
      rules.unique({
        table: 'reports',
        column: 'vet_id',
        where: {
          deleted_at: null,
          user_id: this.refs.userId,
        }}),
    ]),

  })
}
