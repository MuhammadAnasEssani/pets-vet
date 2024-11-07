import {BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from 'App/Models/CommonModel'
import User from 'App/Models/User'

export default class UserDevice extends CommonModel {

  @column({isPrimary: true})
  public id: number

  @column()
  public userId: number

  @column()
  public deviceType: string

  @column()
  public deviceToken: string

  @column()
  public pushNotification: number

  @column()
  public platform: string

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
