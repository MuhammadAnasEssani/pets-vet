import BaseRepo from 'App/Repos/BaseRepo'
import Role from 'App/Models/Role'
import constants from 'Config/constants'
import {SimplePaginatorContract} from '@ioc:Adonis/Lucid/Database'


class RoleRepo extends BaseRepo {
  model

  constructor() {
    const relations = ['permissions']
    const scopes = []
    super(Role, relations, scopes)
    this.model = Role
  }


  async index(orderByColumn: string = constants.ORDER_BY_COLUMN, orderByValue: string = constants.ORDER_BY_VALUE, page: number = 1, perPage: number = constants.PER_PAGE, pagination:boolean=true): Promise<SimplePaginatorContract<any>> {

    let query = this.model.query()

    //todo: In the following line, We need to add a check where the establishment should linked with the restaurant via middleware

    for (let relation of this.relations) query.preload(relation)
    for (let scope of this.scopes) query.withScopes((scopeBuilder) => scopeBuilder[scope].call())
    if (pagination){
      return await query.orderBy(orderByColumn, orderByValue).paginate(page, perPage)
    }else{
      return await query.orderBy(orderByColumn, orderByValue)
    }

  }



}
export default new RoleRepo()
