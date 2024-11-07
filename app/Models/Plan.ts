import {column, HasMany, hasMany, HasOne, hasOne} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import UserSubscription from "App/Models/UserSubscription";
import Transaction from "App/Models/Transaction";

export default class Plan extends CommonModel {
  @column({isPrimary:true})
  public id: number
  @column()
  public amount: number
  @column()
  public currency: string
  @column()
  public description: string
  @column()
  public interval: string
  @column()
  public name: string
  @column()
  public productId: string


  /*
  * ######################### RELATIONS ##########################
  * */

  @hasMany(() => Transaction, {
    foreignKey: 'refId',
    onQuery: (query) =>
      query.where('ref_type', Transaction.TYPES.SUBSCRIPTION).preload('gateway_transaction'),
  })
  public transactions: HasMany<typeof Transaction>

  @hasOne(() => UserSubscription)
  public user_subscription: HasOne<typeof UserSubscription>



  /*
  * ######################### SCOPES ##########################
  * */



  /*
  * ######################### HOOKS ##########################
  * */
}
