import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'
import User from "App/Models/User";

export default class SocialLoginValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    email: schema.string( [
      rules.email(),
      rules.trim()
    ]),
    full_name: schema.string([rules.trim()]),
    client_id: schema.string([rules.trim()]),
    platform: schema.string([rules.trim()]),
    device_type: schema.enum([User.DEVICE_TYPES.MOBILE, User.DEVICE_TYPES.WEB] as const),
    device_token: schema.string([rules.trim()])
  })


}


