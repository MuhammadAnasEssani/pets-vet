import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";

export default class UserSubscriptionValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }
  public schema = schema.create({
    plan_id: schema.number([]),
    subscription_id: schema.string.optional([rules.trim(),rules.maxLength(255),]),
    subscription_next_payment: schema.boolean.optional([]),
    subscription_payment_failed: schema.boolean.optional([]),
    subscription_start_date: schema.boolean.optional([]),
    user_id: schema.number([]),

  })
}
