import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";

export default class ContactValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }
  public schema = schema.create({
    full_name: schema.string([rules.trim(), rules.maxLength(255)]),
    description: schema.string.optional([rules.trim(), rules.maxLength(500)]),
    reason: schema.string.optional([rules.trim(), rules.maxLength(255)]),
    email: schema.string({}, [
      rules.trim(),
      rules.email(),
    ]),
    phone: schema.string.optional([
      rules.mobile({
        strict: true,
      }),
      rules.trim(),
    ]),

  })
}
