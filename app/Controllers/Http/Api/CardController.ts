import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import CardRepo from "App/Repos/CardRepo";
import CardValidator from "App/Validators/CardValidator";
import Attachment from "App/Models/Attachment";


export default class CardController extends ApiBaseController {

  constructor() {
    super(CardRepo)
  }

  async store(ctx: HttpContextContract, instanceType?: number) {
    await super.validateBody(ctx,CardValidator)
    let input = ctx.request.only(this.repo.fillables(['is_active']))
    let row = await CardRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
    return this.apiResponse('Record Added Successfully', row)
  }

  async update(ctx: HttpContextContract, instanceType?: number): Promise<{ data: any; message: string; status: boolean }> {
    await super.validateBody(ctx,CardValidator)
    return super.update(ctx, instanceType)
  }

}
