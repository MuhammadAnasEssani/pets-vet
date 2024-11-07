import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import ScheduleRepo from "App/Repos/ScheduleRepo";
import ScheduleValidator from "App/Validators/ScheduleValidator";
import Attachment from "App/Models/Attachment";
import {schema, validator} from "@ioc:Adonis/Core/Validator";


export default class ScheduleController extends ApiBaseController {

  constructor() {
    super(ScheduleRepo)
  }

  async getScheduleByDate(ctx: HttpContextContract): Promise<{status: boolean; message: string; data: any}> {
    const scheduleValidator = schema.create({
      date: schema.date({
        format: 'iso',
      }),
    })
    const validatedParams = await ctx.request.validate({
      schema: scheduleValidator,
      reporter: validator.reporters.api,
      messages: {
        'date.date.format': 'Invalid date format',
        'date.required': 'Date must be provided',
      },
    })

    const res = await ScheduleRepo.getScheduleByDate(
      validatedParams.date,
    )
    return this.apiResponse('Record fetched successfully', res)
  }

  async store(ctx: HttpContextContract, instanceType?: number) {
    await super.validateBody(ctx,ScheduleValidator)
    let input = ctx.request.only(this.repo.fillables())
    let row = await ScheduleRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
    return this.apiResponse('Record Added Successfully', row)
  }

  async update(ctx: HttpContextContract, instanceType?: number): Promise<{ data: any; message: string; status: boolean }> {
    await super.validateBody(ctx,ScheduleValidator)
    return super.update(ctx, instanceType)
  }

}
