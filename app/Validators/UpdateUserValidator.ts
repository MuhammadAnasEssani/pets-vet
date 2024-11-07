import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'
import User from "App/Models/User";

export default class UpdateUserValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }
  public schema = schema.create({
    email: schema.string.optional( [
      rules.requiredIfExists('email'),
      rules.email(),
      rules.unique({
          table: 'users',
          column: 'email',
          where: {'is_completed': User.PROFILE_COMPLETE_STATUS.COMPLETED},
          whereNot:{email: this.ctx.request.input('email',null)}
        }
      ),
      rules.trim()
    ]),
    phone: schema.string.optional( [
      rules.requiredIfNotExists('email'),
      rules.mobile({
        strict:true
      }),
      rules.unique({table: 'users', column: 'phone',
          where : {'is_completed': User.PROFILE_COMPLETE_STATUS.COMPLETED},
          whereNot : {'phone': this.ctx.request.input('phone',null)},
        }
      ),
      rules.trim()

    ]),
    dob: schema.date({
      format: 'yyyy-MM-dd'
    }),
    full_name: schema.string([rules.trim()]),
    company_name:schema.string([rules.trim()]),
    business_type:schema.string([rules.trim()])
  })




}


