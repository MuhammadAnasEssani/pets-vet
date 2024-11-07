import {BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import Pet from "App/Models/Pet";

export default class Breed extends CommonModel {
  @column({isPrimary:true})
  public id: number
  @column()
  public name: string
  @column()
  public petId: number


  /*
  * ######################### RELATIONS ##########################
  * */
  @belongsTo(() => Pet)
  public pet: BelongsTo<typeof Pet>



  /*
  * ######################### SCOPES ##########################
  * */



  /*
  * ######################### HOOKS ##########################
  * */
}
