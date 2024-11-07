import BaseRepo from 'App/Repos/BaseRepo'
import Transaction from "App/Models/Transaction";
import Database from "@ioc:Adonis/Lucid/Database";
import {ICreateTransaction} from "App/Helpers/Interfaces/TransactionInterface";
import constants from "Config/constants";
import {HttpContext} from "@adonisjs/core/build/standalone";


class TransactionRepo extends BaseRepo {
  model

  constructor() {
    const relations = []
    const scopes = []
    super(Transaction, relations, scopes)
    this.model = Transaction
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
      query.where(function (subQuery) {
        subQuery.whereHas('user', (userQB) => {
          userQB.whereILike('full_name', `%${search}%`).orWhere('email', `%${search}%`)
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

  async saveTransaction(data: ICreateTransaction, userId: number) {
    const {
      refId,
      refType,
      amount,
      gatewayTransaction,
      type,
      trx,
    } = data
    let transaction: Transaction

    transaction = await Transaction.create(
      {
        refId,
        refType,
        amount,
        userId,
        type
      },
      { client: trx }
    )
    if (gatewayTransaction) {
      await transaction.related('gateway_transaction').create({
        gatewayTransactionId: gatewayTransaction.transaction_id,
        transactionId: transaction.id,
        paymentMethodId: "Payment_method_id",
        responseObject: JSON.stringify(gatewayTransaction),
      })
    }
  }

  async saveWebHookTransaction(data: ICreateTransaction, userId: number) {
    const {refId, refType, amount, gatewayTransaction} = data

    const transactionRes = await Database.table('transactions').returning(['id']).insert({
      ref_id: refId,
      ref_type: refType,
      amount: amount,
      user_id: userId,
    })

    if (gatewayTransaction) {
      const transaction: Transaction = await Transaction.findOrFail(transactionRes[0])
      await transaction.related('gateway_transaction').create({
        gatewayTransactionId: gatewayTransaction.id,
        transactionId: transaction.id,
        paymentMethodId: 'payment intent',
        responseObject: gatewayTransaction,
      })
    }
  }
}

export default new TransactionRepo()
