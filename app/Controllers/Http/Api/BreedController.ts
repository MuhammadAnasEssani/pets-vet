import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BreedRepo from "App/Repos/BreedRepo";
import BreedValidator from "App/Validators/BreedValidator";
import Attachment from "App/Models/Attachment";


export default class BreedController extends ApiBaseController {

  constructor() {
    super(BreedRepo)
  }

  async store(ctx: HttpContextContract, instanceType?: number) {
    await super.validateBody(ctx,BreedValidator)
    let input = ctx.request.only(this.repo.fillables())
    let row = await BreedRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
    return this.apiResponse('Record Added Successfully', row)
  }

  async update(ctx: HttpContextContract, instanceType?: number): Promise<{ data: any; message: string; status: boolean }> {
    await super.validateBody(ctx,BreedValidator)
    return super.update(ctx, instanceType)
  }

}
