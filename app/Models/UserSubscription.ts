import {BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import {DateTime} from "luxon";
import Plan from "App/Models/Plan";

export default class UserSubscription extends CommonModel {
  @column({isPrimary:true})
  public id: number
  @column()
  public planId: number
  @column()
  public userId: number
  @column()
  public subscriptionId: string
  @column.dateTime()
  public subscriptionStartDate: DateTime
  @column.dateTime()
  public subscriptionNextPayment: DateTime
  @column()
  public subscriptionPaymentFailed: boolean

  /*
   * ######################### RELATIONS ##########################
   * */

  //Belongs To Patient
  @belongsTo(() => Plan)
  public plan: BelongsTo<typeof Plan>




  /*
  * ######################### SCOPES ##########################
  * */



  /*
  * ######################### HOOKS ##########################
  * */
}
