import {schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'
import Appointment from "App/Models/Appointment";

export default class UpdateAppointmentStatusValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    status: schema.enum([
      Appointment.STATUS.CONFIRMED,
      Appointment.STATUS.REJECTED,
      Appointment.STATUS.CANCELLED,
    ] as const),
  })
}
