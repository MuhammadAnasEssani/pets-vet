import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";

export default class BreedValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public refs = schema.refs({
    petId: this.ctx.request.input('pet_id'),
  })

  public schema = schema.create({
    name: schema.string([
      rules.trim(),
      rules.maxLength(255),
      rules.unique({table: 'breeds', column: 'name',
        where:{
          pet_id: this.refs.petId.value,
          deleted_at: null
        }
      }),
    ]),
    pet_id: schema.number([
      rules.unsigned(),
      rules.exists({table: 'pets', column: 'id',
        where: {
          deleted_at: null,
        },
      }),
    ]),

  })
}
