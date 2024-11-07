import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import VetSpecializationRepo from "App/Repos/VetSpecializationRepo";
import VetSpecializationValidator from "App/Validators/VetSpecializationValidator";
import Attachment from "App/Models/Attachment";


export default class VetSpecializationController extends ApiBaseController {

    constructor() {
        super(VetSpecializationRepo)
    }

    async store(ctx: HttpContextContract, instanceType?: number) {
        await super.validateBody(ctx,VetSpecializationValidator)
        let input = ctx.request.only(this.repo.fillables())
        let row = await VetSpecializationRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract, instanceType?: number): Promise<{ data: any; message: string; status: boolean }> {
        await super.validateBody(ctx,VetSpecializationValidator)
        return super.update(ctx, instanceType)
    }

}
