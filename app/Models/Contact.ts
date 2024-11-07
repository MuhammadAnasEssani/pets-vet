import {beforeCreate, column} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import {HttpContext} from '@adonisjs/core/build/standalone'

export default class Contact extends CommonModel {
  @column({isPrimary:true})
  public id: number
  @column()
  public userId: number
  @column()
  public email: string
  @column()
  public phone: string
  @column()
  public fullName: string
  @column()
  public description: string
  @column()
  public reason: string


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
  public static async setCreator(contact: Contact) {
    const ctx: any = HttpContext.get()
    const user = ctx.auth.use('api').user
    contact.userId = user.id
  }
}
