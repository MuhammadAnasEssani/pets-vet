import {column} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from 'App/Models/CommonModel'

export default class Module extends CommonModel {
  public serializeExtras = true

  @column({isPrimary:true})
  public id: number
  @column()
  public name: string

  static ITEMS = {
    APPOINTMENT_MANAGEMENT :10,
    TRANSACTION_MANAGEMENT: 20,
    SCHEDULE_MANAGEMENT :30,
    USER_MANAGEMENT :40,
    ROLE_MANAGEMENT :50,
    PRESCRIPTION_MANAGEMENT: 60,
    BREED_MANAGEMENT: 70,
    SLOT_MANAGEMENT: 80,
    PET_MANAGEMENT: 90,
    PLAN_MANAGEMENT: 100,
    USER_ADDRESSES: 110,
    CARD_MANAGEMENT: 120
  }




  /*
  * ######################### RELATIONS ##########################
  * */


  /*
  * ######################### SCOPES ##########################
  * */



  /*
  * ######################### HOOKS ##########################
  * */
}
