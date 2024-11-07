import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import PetRepo from "App/Repos/PetRepo";
import PetValidator from "App/Validators/PetValidator";
import Attachment from "App/Models/Attachment";


export default class PetController extends ApiBaseController {

    constructor() {
        super(PetRepo)
    }

    async store(ctx: HttpContextContract, instanceType?: number) {
        await super.validateBody(ctx,PetValidator)
        let input = ctx.request.only(this.repo.fillables())
        let row = await PetRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract, instanceType?: number): Promise<{ data: any; message: string; status: boolean }> {
        await super.validateBody(ctx,PetValidator)
        return super.update(ctx, instanceType)
    }

}
