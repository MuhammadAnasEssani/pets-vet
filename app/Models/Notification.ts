import {BelongsTo, belongsTo, column, scope} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import {HttpContext} from "@adonisjs/core/build/standalone";
import User from "App/Models/User";

export default class Notification extends CommonModel {
  public static TYPES = {
    USER: 10
  }

  public static STATUS = {
    ENABLED: 1,
    DISABLED: 0
  }

  public static NOTIFICATION_REF_TYPE = {
    APPOINTMENT_REMINDER: 10,
    APPOINTMENT_STATUS_CHANGE: 20,
    APPOINTMENT_REQUEST : 30,
    PAYOUT_ALERT: 40,
    USER_APPROVAL: 50,
    ADMIN_PUSH: 60,
    APPOINTMENT_STARTED : 70,
    APPOINTMENT_PAYOUT_SUCCESS : 80,
  }

  @column({isPrimary: true})
  public id: number
  @column()
  public notifiableId: number
  @column()
  public title: string
  @column()
  public message: string
  @column()
  public refId: number
  @column()
  public type: number
  @column()
  public readAt: string
  @column()
  public extra: string
  @column()
  public image: string


  /*
  * ######################### RELATIONS ##########################
  * */


  /*
  * ######################### SCOPES ##########################
  * */
  public static authFilter = scope((query) => {
    const ctx: any = HttpContext.get()
    let userId = ctx.auth?.user?.id
    let unRead = ctx.request.input('unread', null)
    let read = ctx.request.input('read', null)

    if (userId) {
      query.where('notifiable_id', userId)
    }
    if (unRead) {
      // @ts-ignore
      query.where('read_at', null)
    }
    if (read) {
      // @ts-ignore
      query.whereNot('read_at', null)
    }
  })

  @belongsTo(() => User,{
    foreignKey: 'notifiableId',
    onQuery: (query) => query.preload('user_image'),
  })
  public user: BelongsTo<typeof User>


  /*
  * ######################### HOOKS ##########################
  * */
}
