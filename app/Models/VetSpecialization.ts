import {column} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";

export default class VetSpecialization extends CommonModel {

  static PET_TYPES = {
    LARGE_ANIMALS: 10,
    SMALL_ANIMALS: 20,
    EXOTIC_ANIMALS: 30
  }

  @column({isPrimary:true})
  public id: number
  @column()
  public petType: number
  @column()
  public userDetailId: number


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
