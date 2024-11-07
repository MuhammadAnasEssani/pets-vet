import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import UserPetRepo from "App/Repos/UserPetRepo";
import UserPetValidator from "App/Validators/UserPetValidator";
import Attachment from "App/Models/Attachment";


export default class UserPetController extends ApiBaseController {

  constructor() {
    super(UserPetRepo)
  }

  async addUserPets(ctx: HttpContextContract, instanceType?: number) {
    await super.validateBody(ctx,UserPetValidator)
    let input = ctx.request.only(this.repo.fillables())
    const res = await UserPetRepo.addUserPets(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
    return this.apiResponse('Record Added Successfully',res)
  }

  async store(ctx: HttpContextContract, instanceType?: number) {
    await super.validateBody(ctx,UserPetValidator)
    let input = ctx.request.only(this.repo.fillables())
    await UserPetRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
    return this.apiResponse('Record Added Successfully')
  }

  async update(ctx: HttpContextContract, instanceType?: number): Promise<{ data: any; message: string; status: boolean }> {
    await super.validateBody(ctx,UserPetValidator)
    return super.update(ctx, instanceType)
  }

}
