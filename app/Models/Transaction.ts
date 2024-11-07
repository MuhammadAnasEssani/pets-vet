import {BelongsTo, belongsTo, column, computed, HasOne, hasOne} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import Plan from "App/Models/Plan";
import User from "App/Models/User";
import GatewayTransaction from "App/Models/GatewayTransaction";

export default class Transaction extends CommonModel {

  static TYPES = {
    SUBSCRIPTION: 10,
    PLATFORM_CHECK : 20,
    SCHEDULE_APPOINTMENT: 30,
    REFUND_APPOINTMENT: 40,
    PAYOUT_APPOINTMENT: 50
  }

  static TRANSACTION_TYPES = {
    IN: 10,
    OUT : 20
  }

  @column({isPrimary:true})
  public id: number
  @column()
  public amount: number
  @column()
  public refId: number
  @column()
  public refType: number
  @column()
  public userId: number
  @column()
  public type: number


  @computed()
  public get ref_type_text() {
    switch (this.refType) {
      case Transaction.TYPES.SUBSCRIPTION:
        return 'Subscription'
    }
  }

  /*
   * ######################### RELATIONS ##########################
   * */

  @hasOne(() => GatewayTransaction)
  public gateway_transaction: HasOne<typeof GatewayTransaction>

  @belongsTo(() => Plan, {
    foreignKey: 'refId',
    onQuery: (query) =>
      query.whereHas('transactions', (transactionBuilder) => {
        transactionBuilder.where({
          ref_type: Transaction.TYPES.SUBSCRIPTION,
        })
      }),
  })
  public plan: BelongsTo<typeof Plan>

  @belongsTo(() => User, {
    onQuery: (query) => query.preload('user_image').withTrashed(),
  })
  public user: BelongsTo<typeof User>



  /*
  * ######################### SCOPES ##########################
  * */



  /*
  * ######################### HOOKS ##########################
  * */
}
