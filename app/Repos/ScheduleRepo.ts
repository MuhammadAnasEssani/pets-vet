import BaseRepo from 'App/Repos/BaseRepo'
import Schedule from "App/Models/Schedule";
import constants from "Config/constants";
import {HttpContext} from "@adonisjs/core/build/standalone";
import Role from "App/Models/Role";
import ExceptionWithCode from "App/Exceptions/ExceptionWithCode";
import moment from 'moment'


class ScheduleRepo extends BaseRepo {
  model

  constructor() {
    const relations = []
    const scopes = []
    super(Schedule, relations, scopes)
    this.model = Schedule
  }

  async index(
    orderByColumn = constants.ORDER_BY_COLUMN,
    orderByValue = constants.ORDER_BY_VALUE,
    page = 1,
    perPage = constants.PER_PAGE,
    pagination=true
  ) {

    const ctx: any = HttpContext.get()
    const user = ctx.auth.use('api').user
    await user.load('roles')

    const isVet = user!.roles.find((role) => role.id === Role.TYPES.VET)

    const isPet = user!.roles.find((role) => role.id === Role.TYPES.PET)




    const relations = ctx.request.input('relations',[])
    let query = this.model.query()

    if(isVet) {
      query.where('vet_id', user.id)
    }
    if(isPet) {
      const vetId = ctx.request.input('vet_id',null)
      if(!vetId) throw new ExceptionWithCode('Vet id is required' , 400)
      query.where('vet_id',vetId)

    }

    for (let relation of [...this.relations, ...relations]) query.preload(relation)
    for (let scope of this.scopes) query.withScopes((scopeBuilder) => scopeBuilder[scope].call())
    if (pagination){
      return await query.orderBy(orderByColumn, orderByValue).paginate(page, perPage)
    }else{
      return await query.orderBy(orderByColumn, orderByValue)
    }
  }

  async getScheduleByDate(
    date,
  ) {

    const ctx: any = HttpContext.get()
    const user = ctx.auth.use('api').user
    await user.load('roles')

    const isVet = user!.roles.find((role) => role.id === Role.TYPES.VET)

    const isPet = user!.roles.find((role) => role.id === Role.TYPES.PET)

    const specificDate = moment(date.toISO()).format('YYYY-MM-DD')


    const relations = ctx.request.input('relations',[])
    let query = this.model.query()

    if(isVet)
      query.where('vet_id',user.id)

    if(isPet) {
      const vetId = ctx.request.input('vet_id',null)
      if(!vetId) throw new ExceptionWithCode('Vet id is required' , 400)
      query.where('vet_id',vetId)
    }

    query.where('date',specificDate)

    const type = ctx.request.input('type',null)

    if(type) {
      query.where('type',type)
    }

    for (let relation of [...this.relations, ...relations]) query.preload(relation)
    for (let scope of this.scopes) query.withScopes((scopeBuilder) => scopeBuilder[scope].call())

    return query.first()
  }
}

export default new ScheduleRepo()
