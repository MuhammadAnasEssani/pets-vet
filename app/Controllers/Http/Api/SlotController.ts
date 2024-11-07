import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import SlotRepo from "App/Repos/SlotRepo";
import SlotValidator from "App/Validators/SlotValidator";
import Attachment from "App/Models/Attachment";


export default class SlotController extends ApiBaseController {

    constructor() {
        super(SlotRepo)
    }

    async store(ctx: HttpContextContract, instanceType?: number) {
        await super.validateBody(ctx,SlotValidator)
        let input = ctx.request.only(this.repo.fillables())
        let row = await SlotRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract, instanceType?: number): Promise<{ data: any; message: string; status: boolean }> {
        await super.validateBody(ctx,SlotValidator)
        return super.update(ctx, instanceType)
    }

}
