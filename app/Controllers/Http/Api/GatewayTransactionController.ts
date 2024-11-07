import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import GatewayTransactionRepo from "App/Repos/GatewayTransactionRepo";
import GatewayTransactionValidator from "App/Validators/GatewayTransactionValidator";
import Attachment from "App/Models/Attachment";


export default class GatewayTransactionController extends ApiBaseController {

    constructor() {
        super(GatewayTransactionRepo)
    }

    async store(ctx: HttpContextContract, instanceType?: number) {
        await super.validateBody(ctx,GatewayTransactionValidator)
        let input = ctx.request.only(this.repo.fillables())
        let row = await GatewayTransactionRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract, instanceType?: number): Promise<{ data: any; message: string; status: boolean }> {
        await super.validateBody(ctx,GatewayTransactionValidator)
        return super.update(ctx, instanceType)
    }

}
