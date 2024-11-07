import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";
import Attachment from "App/Models/Attachment";
import UserDetail from "App/Models/UserDetail";
import VetSpecialization from "App/Models/VetSpecialization";

export default class UserDetailValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }
  public schema = schema.create({
    about: schema.string.optional([rules.trim(),rules.maxLength(255),]),
    dea_number: schema.string.optional([rules.trim(),rules.maxLength(255),]),
    national_license_number: schema.string.optional([rules.trim(),rules.maxLength(255),]),
    reg_number: schema.string.optional([rules.trim(),rules.maxLength(255),]),
    state_license: schema.string([rules.trim(),rules.maxLength(255),]),
    state_license_number: schema.string([rules.trim(),rules.maxLength(255),]),
    vet_type: schema.enum([UserDetail.VET_TYPES.DVM,UserDetail.VET_TYPES.LVT] as const),
    license_documents: schema.array([rules.minLength(1),rules.maxLength(10)]).members(
      schema.object().members({
        path: schema.string({}, [rules.maxLength(65535)]),
        type: schema.enum([Attachment.MIME_TYPES.EXCEL,Attachment.MIME_TYPES.IMAGE,Attachment.MIME_TYPES.PDF,Attachment.MIME_TYPES.DOCUMENT] as const),
      })
    ),
    vet_specializations: schema.array([rules.minLength(1)]).members(
      schema.object().members({
        pet_type: schema.enum([VetSpecialization.PET_TYPES.EXOTIC_ANIMALS,VetSpecialization.PET_TYPES.LARGE_ANIMALS,VetSpecialization.PET_TYPES.SMALL_ANIMALS] as const),
      })
    ),
    start_time: schema.date.optional({
      format: 'HH:mm:ss',
    }),
    end_time: schema.date.optional({
      format: 'HH:mm:ss',
    }),
  })
}
