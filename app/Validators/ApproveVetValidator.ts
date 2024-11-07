import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";

export default class ApproveVetValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }
  public schema = schema.create({
    vet_id: schema.number([
      rules.unsigned(),
      rules.exists({table: 'users', column: 'id',
        where: {
          deleted_at: null,
          is_verified: true,
          is_approved: false,
          is_completed: true
        },
      }),
    ]),
  })
}
