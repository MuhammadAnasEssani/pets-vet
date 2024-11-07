import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";
import Attachment from "App/Models/Attachment";

export default class UserPetValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }
  public schema = schema.create({
    user_pets: schema.array([rules.minLength(1)]).members(
      schema.object().members({
        name: schema.string([rules.trim(),rules.maxLength(255),]),
        breed_id: schema.number.optional([
          rules.unsigned(),
          rules.exists({table: 'breeds', column: 'id',
            where: {
              deleted_at: null
            },
          }),
        ]),
        breed: schema.string.optional([rules.trim(),rules.maxLength(255),])
      })
    ),
    medical_records: schema.array.optional([rules.maxLength(10)]).members(
      schema.object().members({
        path: schema.string({}, [rules.maxLength(65535)]),
        type: schema.enum([Attachment.MIME_TYPES.EXCEL,Attachment.MIME_TYPES.IMAGE,Attachment.MIME_TYPES.PDF,Attachment.MIME_TYPES.DOCUMENT] as const),
      })
    ),
  })
}
