import {beforeCreate, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import {DateTime} from "luxon";
import {HttpContext} from "@adonisjs/core/build/standalone";
import User from "App/Models/User";
import UserPet from "App/Models/UserPet";

export default class Appointment extends CommonModel {

  static STATUS = {
    PENDING: 10,
    CANCELLED: 20,
    CONFIRMED: 30,
    REJECTED: 40,
    COMPLETED: 50,
    STARTED: 60
  }

  static PAYOUT_STATUS = {
    PENDING: 10,
    COMPLETED: 20,
  }

  static STATUS_TEXT = {
    [this.STATUS.PENDING]: 'Pending',
    [this.STATUS.CONFIRMED]: 'Confirmed',
    [this.STATUS.REJECTED]: 'Rejected',
    [this.STATUS.CANCELLED]: 'Cancelled',
    [this.STATUS.COMPLETED]: 'Completed',
  }

  @column({isPrimary:true})
  public id: number
  @column()
  public amount: number
  @column()
  public status: number
  @column()
  public payoutStatus: number
  @column()
  public reason: string
  @column.dateTime({
    serialize: (value) => {
      return DateTime.fromISO(value).toFormat('HH:mm:ss')
    },
  })
  public startTime: DateTime
  @column.dateTime({
    serialize: (value) => {
      return DateTime.fromISO(value).toFormat('HH:mm:ss')
    },
  })
  public endTime: DateTime
  @column()
  public appointmentDate: string
  @column()
  public joinUrl: string
  @column()
  public startUrl: string
  @column()
  public duration: number
  @column()
  public emergencyCase: boolean
  @column()
  public appointmentId: number
  @column()
  public userPetId: number
  @column()
  public userId: number
  @column()
  public vetId: number
  @column()
  public transactionId: string
  @column()
  public zoomMeetingId: string
  @column()
  public adminCut: number


  /*
  * ######################### RELATIONS ##########################
  * */

  @belongsTo(() => User,{
    foreignKey: 'vetId',
    onQuery: (query) => query.preload('user_image'),
  })
  public vet: BelongsTo<typeof User>

  @belongsTo(() => User,{
    onQuery: (query) => query.preload('user_image').preload('medical_records'),
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => UserPet)
  public user_pet: BelongsTo<typeof UserPet>


  /*
  * ######################### SCOPES ##########################
  * */



  /*
  * ######################### HOOKS ##########################
  * */

  @beforeCreate()
  public static async setCreator(appointment: Appointment) {
    const ctx: any = HttpContext.get()

    const user = ctx.auth.use('api').user
    appointment.userId = user.id
  }


}
