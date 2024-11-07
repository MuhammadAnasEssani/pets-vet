import {BelongsTo, belongsTo, column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import ScheduleSlotTime from "App/Models/ScheduleSlotTime";
import Slot from "App/Models/Slot";
import Schedule from "App/Models/Schedule";

export default class ScheduleSlot extends CommonModel {
  @column({isPrimary:true})
  public id: number
  @column()
  public scheduleId: number
  @column()
  public slotId: number


  /*
  * ######################### RELATIONS ##########################
  * */


  @belongsTo(() => Schedule)
  public schedule: BelongsTo<typeof Schedule>


  @belongsTo(() => Slot)
  public slot: BelongsTo<typeof Slot>

  /*Multiple*/
  @hasMany(() => ScheduleSlotTime)
  public schedule_slot_times: HasMany<typeof ScheduleSlotTime>

  /*
  * ######################### SCOPES ##########################
  * */



  /*
  * ######################### HOOKS ##########################
  * */
}
