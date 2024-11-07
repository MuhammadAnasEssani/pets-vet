import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'
import User from "App/Models/User";

export default class UniqueValidation extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }
  public schema = schema.create({
    email: schema.string.optional( [
      rules.requiredIfExists('email'),
      rules.email(),
      rules.unique({table: 'users', column: 'email', where : {'is_completed': User.PROFILE_COMPLETE_STATUS.COMPLETED}}),
      rules.trim()
    ]),
    phone: schema.string.optional( [
      rules.requiredIfExists('phone'),
      rules.mobile({
        strict:true
      }),
      rules.unique({table: 'users', column: 'phone', where : {'is_completed': User.PROFILE_COMPLETE_STATUS.COMPLETED}}),
      rules.trim()
    ]),
  })




}


