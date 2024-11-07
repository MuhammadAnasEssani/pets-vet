import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";

export default class SlotValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public refs = schema.refs({
    updateId: this.ctx.params?.id || null,
  })

  public schema = schema.create({
    duration: schema.number([
      rules.unsigned(),
      rules.unique({table: 'slots', column: 'duration',
        where:{
          deleted_at: null
        },
        whereNot: {
          id: this.refs.updateId,
        },
      }),
    ]),
    amount: schema.number([
      rules.unsigned()
    ]),

  })
}
