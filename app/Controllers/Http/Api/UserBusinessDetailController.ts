import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import UserBusinessDetailRepo from "App/Repos/UserBusinessDetailRepo";
import UserBusinessDetailValidator from "App/Validators/UserBusinessDetailValidator";
import Attachment from "App/Models/Attachment";


export default class UserBusinessDetailController extends ApiBaseController {

    constructor() {
        super(UserBusinessDetailRepo)
    }

    async store(ctx: HttpContextContract, instanceType?: number) {
        await super.validateBody(ctx,UserBusinessDetailValidator)
        let input = ctx.request.only(this.repo.fillables())
        let row = await UserBusinessDetailRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract, instanceType?: number): Promise<{ data: any; message: string; status: boolean }> {
        await super.validateBody(ctx,UserBusinessDetailValidator)
        return super.update(ctx, instanceType)
    }

}
