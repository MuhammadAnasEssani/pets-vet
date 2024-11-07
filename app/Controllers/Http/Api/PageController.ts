import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import PageRepo from "App/Repos/PageRepo";
import PageValidator from "App/Validators/PageValidator";
import Attachment from "App/Models/Attachment";


export default class PageController extends ApiBaseController {

  constructor() {
    super(PageRepo)
  }

  async store(ctx: HttpContextContract, instanceType?: number) {
    await super.validateBody(ctx,PageValidator)
    let input = ctx.request.only(this.repo.fillables())
    let row = await PageRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
    return this.apiResponse('Record Added Successfully', row)
  }

  async update(ctx: HttpContextContract, instanceType?: number): Promise<{ data: any; message: string; status: boolean }> {
    await super.validateBody(ctx,PageValidator)
    return super.update(ctx, instanceType)
  }

  async pageBySlug(ctx: HttpContextContract) {
    const res = await PageRepo.model.query().where('slug', ctx.request.param('slug')).first()
    return this.apiResponse('Record fetched successfully!', res)
  }

}
