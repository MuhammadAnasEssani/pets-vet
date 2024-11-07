import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";
import Attachment from "App/Models/Attachment";

export default class UpdateHealthRecordValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }
  public schema = schema.create({
    medical_records: schema.array.optional([rules.maxLength(10)]).members(
      schema.object().members({
        path: schema.string({}, [rules.maxLength(65535)]),
        type: schema.enum([Attachment.MIME_TYPES.EXCEL,Attachment.MIME_TYPES.IMAGE,Attachment.MIME_TYPES.PDF,Attachment.MIME_TYPES.DOCUMENT] as const),
      })
    ),
  })
}
