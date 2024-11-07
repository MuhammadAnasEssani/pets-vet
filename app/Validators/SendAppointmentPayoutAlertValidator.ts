import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'
import Appointment from "App/Models/Appointment";

export default class UpdateAppointmentStatusValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public refs = schema.refs({
    userId : this.ctx.auth.use('api').user?.id,
  })

  public schema = schema.create({
    appointment_id: schema.number.optional([
      rules.unsigned(),
      rules.exists({table: 'appointments', column: 'id',
        where: {
          deleted_at: null,
          status: Appointment.STATUS.COMPLETED,
          vet_id: this.refs.userId,
          payout_status: Appointment.PAYOUT_STATUS.PENDING
        },
      }),
    ]),
  })
}
