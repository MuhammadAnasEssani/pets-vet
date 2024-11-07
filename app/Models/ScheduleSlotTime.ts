import {BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import {DateTime} from "luxon";
import ScheduleSlot from "App/Models/ScheduleSlot";

export default class ScheduleSlotTime extends CommonModel {
  @column({isPrimary:true})
  public id: number
  @column()
  public scheduleSlotId: number
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


  /*
  * ######################### RELATIONS ##########################
  * */


  @belongsTo(() => ScheduleSlot)
  public schedule_slot: BelongsTo<typeof ScheduleSlot>



  /*
  * ######################### SCOPES ##########################
  * */



  /*
  * ######################### HOOKS ##########################
  * */
}
