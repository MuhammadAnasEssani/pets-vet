import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";

export default class NotificationValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }
  public schema = schema.create({
    notifiableId: schema.number.optional([]),
    title: schema.string([rules.maxLength(255),rules.trim()]),
    message: schema.string.optional([rules.maxLength(65535),rules.trim()]),
    refId: schema.number.optional([]),
    type: schema.number.optional([]),
    readAt: schema.string.optional([rules.trim()]),
    extra: schema.string.optional([rules.maxLength(255),rules.trim()]),

  })
}
