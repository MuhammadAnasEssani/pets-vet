import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'

export default class UpdateAppointmentStatusValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }


  public schema = schema.create({
    appointment_id: schema.number([
      rules.unsigned(),
      rules.exists({table: 'appointments', column: 'id',
        where: {
          deleted_at: null,
        },
      }),
    ]),
  })
}
