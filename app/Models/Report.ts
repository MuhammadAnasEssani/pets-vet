import {beforeCreate, belongsTo, BelongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import {HttpContext} from "@adonisjs/core/build/standalone";
import User from "App/Models/User";

export default class Report extends CommonModel {
  @column({isPrimary:true})
  public id: number
  @column()
  public reason: string
  @column()
  public userId: number
  @column()
  public vetId: number


  /*
  * ######################### RELATIONS ##########################
  * */
  @belongsTo(() => User,{
    onQuery: (query) => query.preload('user_image')

  })
  public user: BelongsTo<typeof User>



  @belongsTo(() => User, {
    foreignKey: 'vetId',
    onQuery: (query) => query.preload('user_image')
  })
  public vet: BelongsTo<typeof User>


  /*
  * ######################### SCOPES ##########################
  * */



  /*
  * ######################### HOOKS ##########################
  * */

  @beforeCreate()
  public static async setCreator(report: Report) {
    const ctx: any = HttpContext.get()

    const user = ctx.auth.use('api').user
    report.userId = user.id
  }
}
