import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import DayRepo from "App/Repos/DayRepo";
import DayValidator from "App/Validators/DayValidator";
import Attachment from "App/Models/Attachment";


export default class DayController extends ApiBaseController {

    constructor() {
        super(DayRepo)
    }

    async store(ctx: HttpContextContract, instanceType?: number) {
        await super.validateBody(ctx,DayValidator)
        let input = ctx.request.only(this.repo.fillables())
        let row = await DayRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract, instanceType?: number): Promise<{ data: any; message: string; status: boolean }> {
        await super.validateBody(ctx,DayValidator)
        return super.update(ctx, instanceType)
    }

}
