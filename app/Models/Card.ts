import {beforeCreate, column} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import {HttpContext} from '@adonisjs/core/build/standalone'

export default class Card extends CommonModel {
  @column({isPrimary:true})
  public id: number
  @column()
  public userId: number
  @column()
  public brand: string
  @column()
  public last4: string
  @column()
  public isActive: boolean
  @column()
  public paymentMethodId: string


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
  public static async setCreator(card: Card) {
    const ctx: any = HttpContext.get()
    const user = ctx.auth.use('api').user
    card.userId = user.id
  }
}
