import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import ModuleRepo from "App/Repos/ModuleRepo";
import ModuleValidator from "App/Validators/ModuleValidator";
import Attachment from "App/Models/Attachment";


export default class ModuleController extends ApiBaseController {

    constructor() {
        super(ModuleRepo)
    }

    async store(ctx: HttpContextContract, instanceType?: number) {
        await super.validateBody(ctx,ModuleValidator)
        let input = ctx.request.only(this.repo.fillables())
        let row = await ModuleRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract, instanceType?: number): Promise<{ data: any; message: string; status: boolean }> {
        await super.validateBody(ctx,ModuleValidator)
        return super.update(ctx, instanceType)
    }

}
