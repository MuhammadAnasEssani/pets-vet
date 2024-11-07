import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import RoleRepo from 'App/Repos/RoleRepo'
import Attachment from 'App/Models/Attachment'
import constants from 'Config/constants'


export default class RoleController extends ApiBaseController {

  constructor() {
    super(RoleRepo)
  }


  async index(ctx:HttpContextContract): Promise<{ data: any; message: string; status: boolean }> {

    let {pagination} = await super.getValidatedParams(ctx)

    let page = ctx.request.input('page', 1)
    let perPage = ctx.request.input('per-page', constants.PER_PAGE)
    let orderByColumn = ctx.request.input('order-column', constants.ORDER_BY_COLUMN)
    let orderByValue = ctx.request.input('order', constants.ORDER_BY_VALUE)

    let rows = await this.repo.index(orderByColumn, orderByValue, page, perPage,pagination)
    return this.apiResponse('Records fetched successfully', rows)
  }

  async store(ctx: HttpContextContract, instanceType?: number) {
    let input = ctx.request.only(this.repo.fillables())
    let row = await RoleRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
    return this.apiResponse('Record Added Successfully', row)
  }

  async update(ctx: HttpContextContract, instanceType?: number): Promise<{ data: any; message: string; status: boolean }> {
    let input = ctx.request.only(this.repo.fillables(['establishment_id']))
    const res = await this.repo.update(ctx.request.param('id'), input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
    return this.apiResponse('Record updated successfully!', res)
  }

}
