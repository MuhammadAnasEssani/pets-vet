import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'
import User from 'App/Models/User'

export default class LoginValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }
  public schema = schema.create({
    email: schema.string( [
      rules.trim(),
      rules.escape(),
      rules.email(),
      rules.exists({table: 'users', column: 'email'}),
    ]),

    password: schema.string( [
      rules.minLength(6),
    ]),
    device_type: schema.enum([User.DEVICE_TYPES.MOBILE, User.DEVICE_TYPES.WEB] as const),
    device_token: schema.string([
      rules.trim()
    ]),
    platform: schema.enum([User.PLATFORM.IOS, User.PLATFORM.ANDROID, User.PLATFORM.WEB] as const),
  })
}


