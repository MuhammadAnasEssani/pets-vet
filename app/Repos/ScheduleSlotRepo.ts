import BaseRepo from 'App/Repos/BaseRepo'
import ScheduleSlot from "App/Models/ScheduleSlot";
import {RequestContract} from "@ioc:Adonis/Core/Request";
import Database from "@ioc:Adonis/Lucid/Database";
import Schedule from "App/Models/Schedule";
import {HttpContext} from '@adonisjs/core/build/standalone'
import moment from 'moment'
import constants from "Config/constants";
import Role from "App/Models/Role";

class ScheduleSlotRepo extends BaseRepo {
  model

  constructor() {
    const relations = []
    const scopes = []
    super(ScheduleSlot, relations, scopes)
    this.model = ScheduleSlot
  }


  async index(
    orderByColumn = constants.ORDER_BY_COLUMN,
    orderByValue = constants.ORDER_BY_VALUE,
    page = 1,
    perPage = constants.PER_PAGE,
    pagination=true
  ) {
    const ctx: any = HttpContext.get()
    const relations = ctx.request.input('relations',[])
    const user = ctx.auth.use('api').user
    await user.load('roles')

    const isVet = user!.roles.find((role) => role.id === Role.TYPES.VET)

    let query = this.model.query()

    if(isVet) {
      const specificDate = moment().format('YYYY-MM-DD')

      query.whereHas('schedule',(scheduleQB) => {
        scheduleQB.where('vet_id', user.id)
          .where('date', '>=', specificDate);
      })

    }
    for (let relation of [...this.relations, ...relations]) query.preload(relation)
    for (let scope of this.scopes) query.withScopes((scopeBuilder) => scopeBuilder[scope].call())
    if (pagination){
      return await query.orderBy(orderByColumn, orderByValue).paginate(page, perPage)
    }else{
      return await query.orderBy(orderByColumn, orderByValue)
    }
  }

  async store(
    input,
    request: RequestContract,
    _instanceType?: number,
    _deleteOldMedia = false,
    _trx?: any
  ) {
    const scheduleSlot: ScheduleSlot = await Database.transaction(async (trx) => {
      const ctx: any = HttpContext.get()
      const user = ctx.auth.use('api').user

      const data = moment(request.input('date').toISO()).format('YYYY-MM-DD')

      const currentSchedule = await Schedule.query().where("date",data).where("vet_id",user.id).first()

      const schedule = await Schedule.updateOrCreate({
        date: data,
        vetId: user.id
      }, {
        date: data,
        type: request.input('type'),
        vetId: user.id
      }, {client: trx})

      let scheduleSlotQuery = schedule.related('schedule_slots').query()

      if(currentSchedule?.type === request.input('type') && request.input('type') === Schedule.TYPES.SPECIFIC_DATE_TIME)
        scheduleSlotQuery.where('slot_id',input.slot_id)

      let scheduleSlot = await scheduleSlotQuery.first()
      if(!scheduleSlot) {
        scheduleSlot =  await schedule.related('schedule_slots').create(input)
      }
      // const scheduleSlot =  await schedule.related('schedule_slots').create(input)


      if(request.input('type') === Schedule.TYPES.SPECIFIC_DATE_TIME) {
        let scheduleSlotTimes: any[] = []
        for (let scheduleSlotTime of request.input('schedule_slot_times', [])) {
          scheduleSlotTimes.push({
            startTime: scheduleSlotTime.start_time,
            endTime: scheduleSlotTime.end_time,
          })
        }
        await scheduleSlot.related('schedule_slot_times').createMany([...scheduleSlotTimes])
      }

      return scheduleSlot
    })
    return this.show(scheduleSlot.id)
  }
}

export default new ScheduleSlotRepo()
