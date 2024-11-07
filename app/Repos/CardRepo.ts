import BaseRepo from 'App/Repos/BaseRepo'
import Card from "App/Models/Card";
import {RequestContract} from "@ioc:Adonis/Core/Request";
import Database from "@ioc:Adonis/Lucid/Database";
import {HttpContext} from '@adonisjs/core/build/standalone'
import PaypalService from "App/Helpers/PaypalService";
import constants from "Config/constants";

class CardRepo extends BaseRepo {
  model

  constructor() {
    const relations = []
    const scopes = []
    super(Card, relations, scopes)
    this.model = Card
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
    request: RequestContract,
    _instanceType?: number,
    _deleteOldMedia = false,
    _trx?: any
  ) {
    const card: Card = await Database.transaction(async (trx) => {
      const ctx: any = HttpContext.get()
      const user = ctx.auth.use('api').user

      if (!user.customerId) {
        const customer = await PaypalService.createCustomer(user.email,user.fullName)
        user.customerId = customer.customer.id
        user.useTransaction(trx)
        await user.save()
        input.is_active = true
      }

      const card = await PaypalService.addPaymentMethod(user.customerId,request.input('card_token'))


      input.payment_method_id = card?.paymentMethod?.token
      input.last4 = card?.paymentMethod?.last4
      input.brand = card?.paymentMethod?.cardType

      let row = await this.model.create(input, {client: trx})

      return row
    })

    return this.show(card.id)
  }
}

export default new CardRepo()
