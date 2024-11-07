import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import ScheduleSlotTimeRepo from "App/Repos/ScheduleSlotTimeRepo";
import ScheduleSlotTimeValidator from "App/Validators/ScheduleSlotTimeValidator";
import Attachment from "App/Models/Attachment";


export default class ScheduleSlotTimeController extends ApiBaseController {

    constructor() {
        super(ScheduleSlotTimeRepo)
    }

    async store(ctx: HttpContextContract, instanceType?: number) {
        await super.validateBody(ctx,ScheduleSlotTimeValidator)
        let input = ctx.request.only(this.repo.fillables())
        let row = await ScheduleSlotTimeRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract, instanceType?: number): Promise<{ data: any; message: string; status: boolean }> {
        await super.validateBody(ctx,ScheduleSlotTimeValidator)
        return super.update(ctx, instanceType)
    }

}
