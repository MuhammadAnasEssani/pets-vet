import BaseRepo from 'App/Repos/BaseRepo'
import Report from "App/Models/Report";
import constants from "Config/constants";
import {HttpContext} from "@adonisjs/core/build/standalone";


class ReportRepo extends BaseRepo {
  model

  constructor() {
    const relations = []
    const scopes = []
    super(Report, relations, scopes)
    this.model = Report
  }


  async index(
    orderByColumn = constants.ORDER_BY_COLUMN,
    orderByValue = constants.ORDER_BY_VALUE,
    page = 1,
    perPage = constants.PER_PAGE,
    pagination=true
  ) {
    const ctx: any = HttpContext.get()
    const relations = ctx.request.input('relations',[])
    let query = this.model.query()
    const search = ctx.request.input('search', null)

    if (search) {
      query.where(function (subQuery) {
        subQuery.whereHas('user', (userQB) => {
          userQB.whereILike('full_name', `%${search}%`).orWhereILike('email', `%${search}%`)
        })
      }).orWhere(function (subQuery) {
        subQuery.whereHas('vet', (userQB) => {
          userQB.whereILike('full_name', `%${search}%`).orWhereILike('email', `%${search}%`)
        })
      })
    }
    for (let relation of [...this.relations, ...relations]) query.preload(relation)
    for (let scope of this.scopes) query.withScopes((scopeBuilder) => scopeBuilder[scope].call())
    if (pagination){
      return await query.orderBy(orderByColumn, orderByValue).paginate(page, perPage)
    }else{
      return await query.orderBy(orderByColumn, orderByValue)
    }
  }
}

export default new ReportRepo()
