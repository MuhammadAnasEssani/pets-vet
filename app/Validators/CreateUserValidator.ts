import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'
import Role from 'App/Models/Role'

export default class CreateUserValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }


  public schema = schema.create({
    email: schema.string({}, [
      rules.trim(),
      rules.email(),
      rules.unique({table: 'users', column: 'email'}),
    ]),
    phone: schema.string( [
      rules.mobile({
        strict: true
      }),
      rules.trim(),
      rules.unique({table: 'users', column: 'phone'}),
    ]),
    alternate_phone: schema.string.optional( [
      rules.trim(),
      rules.mobile({
        strict: true
      }),
    ]),
    password: schema.string({}, [
      rules.trim(),
      rules.minLength(6),
    ]),
    full_name: schema.string([rules.trim()]),
    image_url: schema.string.optional([rules.trim()]),
    access_pharmacy: schema.boolean.optional([rules.requiredWhen('role_id', '=', Role.TYPES.PET)]),
    share_pet_record: schema.boolean.optional([rules.requiredWhen('role_id', '=', Role.TYPES.PET)]),
    latitude: schema.number.optional(),
    longitude: schema.number.optional(),
    address: schema.string.optional([rules.trim()]),
    role_id: schema.number([
      rules.exists({
        table: 'roles',
        column: 'id',
        where: {
          deleted_at: null
        },
        whereNot: {
          id: [Role.TYPES.ADMIN]
        }
      })
    ])
  })


}


