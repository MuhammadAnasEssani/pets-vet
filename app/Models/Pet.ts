import {column} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";

export default class Pet extends CommonModel {
  @column({isPrimary:true})
  public id: number
  @column()
  public name: string


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
