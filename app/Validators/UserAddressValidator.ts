import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";

export default class UserAddressValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }
  public schema = schema.create({
    latitude: schema.number([]),
    longitude: schema.number([]),
    is_default: schema.boolean.optional(),
    address: schema.string([rules.trim()]),
    city: schema.string([rules.trim()]),
  })
}
