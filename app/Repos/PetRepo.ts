import BaseRepo from 'App/Repos/BaseRepo'
import Pet from "App/Models/Pet";
import constants from "Config/constants";
import {HttpContext} from "@adonisjs/core/build/standalone";


class PetRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        const scopes = []
        super(Pet, relations, scopes)
        this.model = Pet
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
    const search = ctx.request.input('search', null)

    let query = this.model.query()

    if(search) {
      query.whereILike('name', `%${search}%`)
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

export default new PetRepo()
