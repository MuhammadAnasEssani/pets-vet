import {column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import ScheduleSlot from "App/Models/ScheduleSlot";

export default class Schedule extends CommonModel {

  static TYPES = {
    FULL_TIME: 10,
    SPECIFIC_DATE_TIME: 20
  }

  @column({isPrimary:true})
  public id: number
  @column()
  public vetId: number
  @column()
  public date: string
  @column()
  public type: number


  /*
  * ######################### RELATIONS ##########################
  * */

  /*Multiple*/
  @hasMany(() => ScheduleSlot,{
    onQuery: query => query.preload('schedule_slot_times').preload('slot')
  })
  public schedule_slots: HasMany<typeof ScheduleSlot>


  /*
  * ######################### SCOPES ##########################
  * */



  /*
  * ######################### HOOKS ##########################
  * */
}
