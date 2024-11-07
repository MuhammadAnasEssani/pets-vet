import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import ReportRepo from "App/Repos/ReportRepo";
import ReportValidator from "App/Validators/ReportValidator";
import Attachment from "App/Models/Attachment";


export default class ReportController extends ApiBaseController {

  constructor() {
    super(ReportRepo)
  }

  async store(ctx: HttpContextContract, instanceType?: number) {
    await super.validateBody(ctx,ReportValidator)
    let input = ctx.request.only(this.repo.fillables())
    let row = await ReportRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
    return this.apiResponse('Record Added Successfully', row)
  }

  async update(ctx: HttpContextContract, instanceType?: number): Promise<{ data: any; message: string; status: boolean }> {
    await super.validateBody(ctx,ReportValidator)
    return super.update(ctx, instanceType)
  }

}
