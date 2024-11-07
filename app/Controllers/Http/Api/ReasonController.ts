import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import ReasonRepo from "App/Repos/ReasonRepo";
import ReasonValidator from "App/Validators/ReasonValidator";
import Attachment from "App/Models/Attachment";


export default class ReasonController extends ApiBaseController {

    constructor() {
        super(ReasonRepo)
    }

    async store(ctx: HttpContextContract, instanceType?: number) {
        await super.validateBody(ctx,ReasonValidator)
        let input = ctx.request.only(this.repo.fillables())
        let row = await ReasonRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract, instanceType?: number): Promise<{ data: any; message: string; status: boolean }> {
        await super.validateBody(ctx,ReasonValidator)
        return super.update(ctx, instanceType)
    }

}
