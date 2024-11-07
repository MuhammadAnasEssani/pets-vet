import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import SavedSearchRepo from "App/Repos/SavedSearchRepo";
import SavedSearchValidator from "App/Validators/SavedSearchValidator";
import Attachment from "App/Models/Attachment";


export default class SavedSearchController extends ApiBaseController {

    constructor() {
        super(SavedSearchRepo)
    }

    async store(ctx: HttpContextContract, instanceType?: number) {
        await super.validateBody(ctx,SavedSearchValidator)
        let input = ctx.request.only(this.repo.fillables())
        let row = await SavedSearchRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract, instanceType?: number): Promise<{ data: any; message: string; status: boolean }> {
        await super.validateBody(ctx,SavedSearchValidator)
        return super.update(ctx, instanceType)
    }

}
