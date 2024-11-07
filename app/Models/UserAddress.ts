import {afterFind, beforeCreate, beforeDelete, beforeUpdate, column} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import {HttpContext} from "@adonisjs/core/build/standalone";
import InvalidRoleAccess from "App/Exceptions/InvalidRoleAccess";

export default class UserAddress extends CommonModel {
  @column({isPrimary:true})
  public id: number
  @column()
  public latitude: number
  @column()
  public longitude: number
  @column()
  public isDefault: boolean
  @column()
  public userId: number
  @column()
  public address: string
  @column()
  public city: string


  /*
  * ######################### RELATIONS ##########################
  * */

  @beforeCreate()
  public static async setCreator(userAddress: UserAddress) {
    const ctx: any = HttpContext.get()

    const user = ctx.auth.use('api').user
    userAddress.userId = user.id
  }

  @beforeUpdate()
  @beforeDelete()
  @afterFind()
  public static async patientVerificationHook(userAddress: UserAddress) {
    const ctx: any = HttpContext.get()
    const user = ctx.auth.use('api').user

    if (user.id !== userAddress.userId) throw new InvalidRoleAccess()
  }


  /*
  * ######################### SCOPES ##########################
  * */



  /*
  * ######################### HOOKS ##########################
  * */
}
