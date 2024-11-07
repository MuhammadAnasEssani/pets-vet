import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import UserDetailRepo from "App/Repos/UserDetailRepo";
import UserDetailValidator from "App/Validators/UserDetailValidator";
import Attachment from "App/Models/Attachment";


export default class UserDetailController extends ApiBaseController {

  constructor() {
    super(UserDetailRepo)
  }

  async store(ctx: HttpContextContract, instanceType?: number) {
    await super.validateBody(ctx,UserDetailValidator)
    let input = ctx.request.only(this.repo.fillables(['user_id']))
    let row = await UserDetailRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
    return this.apiResponse('Record Added Successfully', row)
  }

  async update(ctx: HttpContextContract, instanceType?: number): Promise<{ data: any; message: string; status: boolean }> {
    await super.validateBody(ctx,UserDetailValidator)
    return super.update(ctx, instanceType)
  }

}
