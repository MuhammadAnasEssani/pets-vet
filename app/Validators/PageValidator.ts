import {schema, rules} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";

export default class PageValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    title: schema.string( [rules.maxLength(255),rules.trim()]),
    content: schema.string.optional({trim: true}, [rules.maxLength(65535),])
  })
}
