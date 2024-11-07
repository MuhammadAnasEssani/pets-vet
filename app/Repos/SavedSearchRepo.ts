import BaseRepo from 'App/Repos/BaseRepo'
import SavedSearch from "App/Models/SavedSearch";
import {RequestContract} from "@ioc:Adonis/Core/Request";
import {HttpContext} from '@adonisjs/core/build/standalone'
import constants from "Config/constants";


class SavedSearchRepo extends BaseRepo {
  model

  constructor() {
    const relations = []
    const scopes = []
    super(SavedSearch, relations, scopes)
    this.model = SavedSearch
  }

  async index(
    orderByColumn = constants.ORDER_BY_COLUMN,
    orderByValue = constants.ORDER_BY_VALUE,
    page = 1,
    perPage = constants.PER_PAGE,
    pagination = true
  ) {
    const ctx: any = HttpContext.get()
    const user = ctx.auth.use('api').user
    const relations = ctx.request.input('relations', [])
    let query = this.model.query()

    query.where('user_id', user.id)
    for (let relation of [...this.relations, ...relations]) query.preload(relation)
    for (let scope of this.scopes) query.withScopes((scopeBuilder) => scopeBuilder[scope].call())
    if (pagination) {
      return await query.orderBy(orderByColumn, orderByValue).paginate(page, perPage)
    } else {
      return await query.orderBy(orderByColumn, orderByValue)
    }
  }

  async store(
    input,
    _request?: RequestContract,
    _instanceType?: number,
    _deleteOldMedia = false,
    trx?: any
  ) {
    const ctx: any = HttpContext.get()
    const user = ctx.auth.use('api').user
    const savedSearches = await this.model.query().where('user_id', user.id).whereNot('text',input.text)

    if (savedSearches.length >= 10) {
      // Fetch the oldest record by created_at timestamp
      const oldestRecord = await this.model.query().orderBy('id', 'asc').first()

      if (oldestRecord) {
        // Delete the oldest record
        await oldestRecord.forceDelete()
      }
    }

    let row = await this.model.updateOrCreate({
      text: input.text
    },input, {client: trx})

    return row
  }
}

export default new SavedSearchRepo()
