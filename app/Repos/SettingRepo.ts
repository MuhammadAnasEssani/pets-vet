import BaseRepo from 'App/Repos/BaseRepo'
import Setting from "App/Models/Setting";
import {HttpContext} from "@adonisjs/core/build/standalone";


class SettingRepo extends BaseRepo {
  model

  constructor() {
    const relations = []
    const scopes = []
    super(Setting, relations, scopes)
    this.model = Setting
  }


  async getSetting() {
    const ctx: any = HttpContext.get()
    const relations = ctx.request.input('relations',[])

    let query = this.model.query()
    for (let relation of [...this.relations, ...relations]) query.preload(relation)
    for (let scope of this.scopes) query.withScopes((scopeBuilder) => scopeBuilder[scope].call())
    return query.firstOrFail()
  }
}

export default new SettingRepo()
