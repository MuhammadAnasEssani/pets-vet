import BaseRepo from 'App/Repos/BaseRepo'
import Breed from "App/Models/Breed";
import constants from "Config/constants";
import {HttpContext} from "@adonisjs/core/build/standalone";


class BreedRepo extends BaseRepo {
  model

  constructor() {
    const relations = []
    const scopes = []
    super(Breed, relations, scopes)
    this.model = Breed
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

    const petId = ctx.request.input('pet_id',null)

    const search = ctx.request.input('search', null)

    let query = this.model.query()

    if(search) {
      query.whereILike('name', `%${search}%`)
    }

    if(petId)
      query.where('pet_id',petId)

    for (let relation of [...this.relations, ...relations]) query.preload(relation)
    for (let scope of this.scopes) query.withScopes((scopeBuilder) => scopeBuilder[scope].call())
    if (pagination){
      return await query.orderBy(orderByColumn, orderByValue).paginate(page, perPage)
    }else{
      return await query.orderBy(orderByColumn, orderByValue)
    }
  }
}

export default new BreedRepo()
