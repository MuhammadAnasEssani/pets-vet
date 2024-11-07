import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'
import VetSpecialization from "App/Models/VetSpecialization";
import UserDetail from "App/Models/UserDetail";

export default class UserValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public refs = schema.refs({
    updateId : this.ctx.auth.use('api').user?.id

  })

  public schema = schema.create({
    phone: schema.string( [
      rules.mobile({
        strict: true
      }),
      rules.trim(),
      rules.unique({
        table: 'users', column: 'phone',
        where: {'is_verified': 1},
        whereNot:{id: this.refs.updateId,}
      }),
    ]),
    alternate_phone: schema.string.optional( [
      rules.trim(),
      rules.mobile({
        strict: true
      }),
    ]),
    full_name: schema.string([rules.trim()]),
    image_url: schema.string.optional([rules.trim()]),
    access_pharmacy: schema.boolean.optional(),
    share_pet_record: schema.boolean.optional(),
    latitude: schema.number.optional(),
    longitude: schema.number.optional(),
    address: schema.string.optional([rules.trim()]),
    dea_number: schema.string.optional([rules.trim(),rules.maxLength(255),]),
    vet_specializations: schema.array.optional([rules.minLength(1)]).members(
      schema.object().members({
        pet_type: schema.enum([VetSpecialization.PET_TYPES.EXOTIC_ANIMALS,VetSpecialization.PET_TYPES.LARGE_ANIMALS,VetSpecialization.PET_TYPES.SMALL_ANIMALS] as const),
      })
    ),
    vet_type: schema.enum.optional([UserDetail.VET_TYPES.DVM,UserDetail.VET_TYPES.LVT] as const),
    start_time: schema.date.optional({
      format: 'HH:mm:ss',
    }),
    end_time: schema.date.optional({
      format: 'HH:mm:ss',
    }),
  })


}


