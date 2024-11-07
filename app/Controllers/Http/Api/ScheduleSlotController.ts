import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import ScheduleSlotRepo from "App/Repos/ScheduleSlotRepo";
import ScheduleSlotValidator from "App/Validators/ScheduleSlotValidator";
import Attachment from "App/Models/Attachment";


export default class ScheduleSlotController extends ApiBaseController {

  constructor() {
    super(ScheduleSlotRepo)
  }

  async store(ctx: HttpContextContract, instanceType?: number) {
    await super.validateBody(ctx,ScheduleSlotValidator)
    let input = ctx.request.only(this.repo.fillables(["schedule_id"]))
    let row = await ScheduleSlotRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
    return this.apiResponse('Record Added Successfully', row)
  }

  async update(ctx: HttpContextContract, instanceType?: number): Promise<{ data: any; message: string; status: boolean }> {
    await super.validateBody(ctx,ScheduleSlotValidator)
    return super.update(ctx, instanceType)
  }

}
