import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import TransactionRepo from "App/Repos/TransactionRepo";
import TransactionValidator from "App/Validators/TransactionValidator";
import Attachment from "App/Models/Attachment";


export default class TransactionController extends ApiBaseController {

    constructor() {
        super(TransactionRepo)
    }

    async store(ctx: HttpContextContract, instanceType?: number) {
        await super.validateBody(ctx,TransactionValidator)
        let input = ctx.request.only(this.repo.fillables())
        let row = await TransactionRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract, instanceType?: number): Promise<{ data: any; message: string; status: boolean }> {
        await super.validateBody(ctx,TransactionValidator)
        return super.update(ctx, instanceType)
    }

}
