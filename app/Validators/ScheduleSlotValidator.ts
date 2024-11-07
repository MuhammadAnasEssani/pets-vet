import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";
import Schedule from "App/Models/Schedule";

export default class ScheduleSlotValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }
  public schema = schema.create({
    slot_id: schema.number([]),
    date: schema.date({
      format: 'iso',
    }),
    type: schema.enum([Schedule.TYPES.FULL_TIME,Schedule.TYPES.SPECIFIC_DATE_TIME] as const),
    schedule_slot_times: schema.array.optional([rules.minLength(1),rules.requiredWhen('type', '=', Schedule.TYPES.SPECIFIC_DATE_TIME),]).members(
      schema.object().members({
        start_time: schema.date({
          format: 'HH:mm:ss',
        }),
        end_time: schema.date({
          format: 'HH:mm:ss',
        }),
      })
    ),
  })
}
