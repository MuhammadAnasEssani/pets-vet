import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import ContactRepo from "App/Repos/ContactRepo";
import ContactValidator from "App/Validators/ContactValidator";
import Attachment from "App/Models/Attachment";


export default class ContactController extends ApiBaseController {

  constructor() {
    super(ContactRepo)
  }

  async store(ctx: HttpContextContract, instanceType?: number) {
    await super.validateBody(ctx,ContactValidator)
    let input = ctx.request.only(this.repo.fillables())
    let row = await ContactRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
    return this.apiResponse('Record Added Successfully', row)
  }

  async update(ctx: HttpContextContract, instanceType?: number): Promise<{ data: any; message: string; status: boolean }> {
    await super.validateBody(ctx,ContactValidator)
    return super.update(ctx, instanceType)
  }

}
