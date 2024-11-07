import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import SettingRepo from "App/Repos/SettingRepo";
import SettingValidator from "App/Validators/SettingValidator";
import Attachment from "App/Models/Attachment";


export default class SettingController extends ApiBaseController {

  constructor() {
    super(SettingRepo)
  }


  async getSetting() {
    const res = await this.repo.getSetting()
    return this.apiResponse('Record fetched successfully!', res)
  }

  async store(ctx: HttpContextContract, instanceType?: number) {
    await super.validateBody(ctx,SettingValidator)
    let input = ctx.request.only(this.repo.fillables())
    let row = await SettingRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
    return this.apiResponse('Record Added Successfully', row)
  }

  async update(ctx: HttpContextContract, instanceType?: number): Promise<{ data: any; message: string; status: boolean }> {
    await super.validateBody(ctx,SettingValidator)
    return super.update(ctx, instanceType)
  }

}
