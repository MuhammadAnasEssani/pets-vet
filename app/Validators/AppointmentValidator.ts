import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";
import Appointment from "App/Models/Appointment";

export default class AppointmentValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public refs = schema.refs({
    userId : this.ctx.auth.use('api').user?.id,
    vetId : this.ctx.request.input('vet_id'),
    userPetId : this.ctx.request.input('user_pet_id')
  })

  public schema = schema.create({
    slot_id: schema.number([
      rules.unsigned(),
      rules.exists({table: 'slots', column: 'id',
        where: {
          deleted_at: null
        },
      }),
    ]),
    reason: schema.string([rules.trim(),rules.maxLength(255),]),
    start_time: schema.date({
      format: 'HH:mm:ss',
    }),
    end_time: schema.date({
      format: 'HH:mm:ss',
    }),
    appointment_date: schema.date({
      format: 'iso',
    }),
    emergency_case: schema.boolean.optional([]),
    user_pet_id: schema.number([
      rules.unsigned(),
      rules.exists({table: 'user_pets', column: 'id',
        where: {
          deleted_at: null,
          user_id: this.refs.userId,
        },
      }),
    ]),
    appointment_id: schema.number.optional([
      rules.unsigned(),
      rules.exists({table: 'appointments', column: 'id',
        where: {
          deleted_at: null,
          status: Appointment.STATUS.COMPLETED,
          user_id: this.refs.userId,
          vet_id: this.refs.vetId,
          user_pet_id: this.refs.userPetId
        },
      }),
    ]),
    vet_id: schema.number([
      rules.unsigned(),
      rules.exists({table: 'users', column: 'id',
        where: {
          deleted_at: null,
          is_verified: true,
          // is_approved: true,
          is_completed: true
        },
      }),
    ]),
    payment_method: schema.string([rules.trim()]),
    paypal_pay : schema.boolean.optional([])
  })
}
