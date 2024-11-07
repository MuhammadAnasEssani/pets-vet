import BaseRepo from 'App/Repos/BaseRepo'
import UserAddress from "App/Models/UserAddress";
import constants from "Config/constants";
import {HttpContext} from "@adonisjs/core/build/standalone";
import {RequestContract} from "@ioc:Adonis/Core/Request";
import Database from "@ioc:Adonis/Lucid/Database";


class UserAddressRepo extends BaseRepo {
  model

  constructor() {
    const relations = []
    const scopes = []
    super(UserAddress, relations, scopes)
    this.model = UserAddress
  }

  async index(
    orderByColumn = constants.ORDER_BY_COLUMN,
    orderByValue = constants.ORDER_BY_VALUE,
    page = 1,
    perPage = constants.PER_PAGE,
    pagination=true
  ) {
    const ctx: any = HttpContext.get()
    const user = ctx.auth.use('api').user

    const relations = ctx.request.input('relations',[])
    let query = this.model.query().where('user_id',user.id)
    for (let relation of [...this.relations, ...relations]) query.preload(relation)
    for (let scope of this.scopes) query.withScopes((scopeBuilder) => scopeBuilder[scope].call())
    if (pagination){
      return await query.orderBy(orderByColumn, orderByValue).paginate(page, perPage)
    }else{
      return await query.orderBy(orderByColumn, orderByValue)
    }
  }

  async changeAddressDefault(id: number, request : RequestContract) {
    await Database.transaction(async (trx) => {
      const ctx: any = HttpContext.get()
      const user = ctx.auth.use('api').user

      user.useTransaction(trx)

      const isDefault = request.input('is_default')

      if (isDefault) {
        await user.related('user_addresses').query().where('user_id',user.id).whereNot('id',id).update({
          isDefault : false
        })
      }


      return  user.related('user_addresses').query().where('id',id).update({
        isDefault
      })
    })
    return this.show(id)
  }
}

export default new UserAddressRepo()
