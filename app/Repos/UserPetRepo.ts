import BaseRepo from 'App/Repos/BaseRepo'
import UserPet from "App/Models/UserPet";
import {RequestContract} from "@ioc:Adonis/Core/Request";
import Attachment from "App/Models/Attachment";
import {HttpContext} from "@adonisjs/core/build/standalone";
import Database from "@ioc:Adonis/Lucid/Database";
import constants from "Config/constants";
import ExceptionWithCode from "App/Exceptions/ExceptionWithCode";


class UserPetRepo extends BaseRepo {
  model

  constructor() {
    const relations = []
    const scopes = []
    super(UserPet, relations, scopes)
    this.model = UserPet
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

    const relations = ctx.request.input('relations',[])
    let query = this.model.query().where('user_id',user.id)
    for (let relation of [...this.relations, ...relations]) query.preload(relation)
    for (let scope of this.scopes) query.withScopes((scopeBuilder) => scopeBuilder[scope].call())
    if (pagination){
      return await query.orderBy(orderByColumn, orderByValue).paginate(page, perPage)
    }else{
      return await query.orderBy(orderByColumn, orderByValue)
    }
  }

  async addUserPets(
    _input,
    request: RequestContract,
    _instanceType?: number,
    _deleteOldMedia = false,
    _trx?: any
  ) {
    const userPets : UserPet[] = await Database.transaction(async (trx) => {
      const ctx: any = HttpContext.get()
      const user = ctx.auth.use('api').user

      user.useTransaction(trx)

      const currentTime = new Date();  // Get current timestamp

      await user.related('user_pets').query().update({
        deleted_at: currentTime
      });

      let userPets: any[] = []
      for (let userPet of request.input('user_pets', [])) {
        userPets.push({
          name: userPet.name,
          breedId: userPet.breedId,
          breed: userPet.breed
        })
      }
      return  user.related('user_pets').createMany([...userPets])

    })

    return userPets

  }

  async store(
    _input,
    request: RequestContract,
    _instanceType?: number,
    _deleteOldMedia = false,
    _trx?: any
  ) {
    await Database.transaction(async (trx) => {
      const ctx: any = HttpContext.get()
      const user = ctx.auth.use('api').user

      user.useTransaction(trx)

      if (user.isCompleted) throw new ExceptionWithCode('Account setup already done', 400)

      await user.merge({isCompleted: true}).save()


      let userPets: any[] = []
      for (let userPet of request.input('user_pets', [])) {
        userPets.push({
          name: userPet.name,
          breedId: userPet.breedId,
          breed: userPet.breed
        })
      }
      await user.related('user_pets').createMany([...userPets])

      if (request.input('medical_records', null)) {


        let medicalRecords: any[] = []
        for (let media of request.input('medical_records', [])) {
          medicalRecords.push({
            path: media.path,
            instanceType: Attachment.TYPE.PET_MEDICAL_RECORDS,
            mimeType: media.type,
          })
        }
        await user.related('medical_records').createMany([...medicalRecords])
      }

    })

  }
}

export default new UserPetRepo()
