import {column} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";

export default class UserPet extends CommonModel {
  @column({isPrimary:true})
  public id: number
  @column()
  public name: string
  @column()
  public breedId: number
  @column()
  public userId: number
  @column()
  public breed: string


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
