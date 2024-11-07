import {beforeCreate, column} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import {HttpContext} from '@adonisjs/core/build/standalone'

export default class SavedSearch extends CommonModel {
  @column({isPrimary:true})
  public id: number
  @column()
  public text: string
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

  @beforeCreate()
  public static async setCreator(savedSearch: SavedSearch) {
    const ctx: any = HttpContext.get()
    const user = ctx.auth.use('api').user
    savedSearch.userId = user.id
  }
}
