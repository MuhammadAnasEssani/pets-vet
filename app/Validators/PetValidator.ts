import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";

export default class PetValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }
  public schema = schema.create({
    name: schema.string([
      rules.trim(),
      rules.maxLength(255),
      rules.unique({
        table: 'pets',
        column: 'name',
        where:{
          deleted_at: null
        }
      }),
    ]),

  })
}
