import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import PlanRepo from "App/Repos/PlanRepo";
import PlanValidator from "App/Validators/PlanValidator";
import Attachment from "App/Models/Attachment";


export default class PlanController extends ApiBaseController {

    constructor() {
        super(PlanRepo)
    }

    async store(ctx: HttpContextContract, instanceType?: number) {
        await super.validateBody(ctx,PlanValidator)
        let input = ctx.request.only(this.repo.fillables())
        let row = await PlanRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract, instanceType?: number): Promise<{ data: any; message: string; status: boolean }> {
        await super.validateBody(ctx,PlanValidator)
        return super.update(ctx, instanceType)
    }

}
