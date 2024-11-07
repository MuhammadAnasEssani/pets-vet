import {column} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from 'App/Models/CommonModel'

export default class UserBusinessDetail extends CommonModel {
  @column({isPrimary:true})
  public id: number
  @column()
  public businessName: string
  @column()
  public businessAddress: string
  @column()
  public bankAccountNumber: string
  @column()
  public bankRoutingNumber: string
  @column()
  public taxIdNumber: string
  @column()
  public userId: number


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
