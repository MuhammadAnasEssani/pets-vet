import {schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";

export default class TransactionValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }
  public schema = schema.create({
    amount: schema.number([]),
    ref_id: schema.number([]),
    ref_type: schema.number([]),
    user_id: schema.number([]),

  })
}
