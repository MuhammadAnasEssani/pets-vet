import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import UserAddressRepo from "App/Repos/UserAddressRepo";
import UserAddressValidator from "App/Validators/UserAddressValidator";
import Attachment from "App/Models/Attachment";
import UpdateAddressDefaultValidator from "App/Validators/UpdateAddressDefaultValidator";


export default class UserAddressController extends ApiBaseController {

  constructor() {
    super(UserAddressRepo)
  }

  async store(ctx: HttpContextContract, instanceType?: number) {
    await super.validateBody(ctx,UserAddressValidator)
    let input = ctx.request.only(this.repo.fillables(['is_default']))
    let row = await UserAddressRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
    return this.apiResponse('Record Added Successfully', row)
  }

  async update(ctx: HttpContextContract, instanceType?: number): Promise<{ data: any; message: string; status: boolean }> {
    await super.validateBody(ctx,UserAddressValidator)
    return super.update(ctx, instanceType)
  }

  async changeAddressDefault(ctx: HttpContextContract): Promise<{ data: any; message: string; status: boolean }> {
    await super.validateBody(ctx,UpdateAddressDefaultValidator)
    const res = await this.repo.changeAddressDefault(ctx.request.param('id'), ctx.request)
    return this.apiResponse('Record updated successfully!', res)
  }

}
