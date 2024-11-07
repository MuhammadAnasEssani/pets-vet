import BaseRepo from 'App/Repos/BaseRepo'
import UserDetail from "App/Models/UserDetail";
import {RequestContract} from "@ioc:Adonis/Core/Request";
import Database from "@ioc:Adonis/Lucid/Database";
import ExceptionWithCode from "App/Exceptions/ExceptionWithCode";
import User from "App/Models/User";
import {HttpContext} from '@adonisjs/core/build/standalone'
import Attachment from "App/Models/Attachment";

class UserDetailRepo extends BaseRepo {
  model

  constructor() {
    const relations = []
    const scopes = []
    super(UserDetail, relations, scopes)
    this.model = UserDetail
  }

  async store(
    input,
    request: RequestContract,
    _instanceType?: number,
    _deleteOldMedia = false,
    _trx?: any
  ) {
    const userDetail: UserDetail = await Database.transaction(async (trx) => {
      const ctx: any = HttpContext.get()
      const user = ctx.auth.use('api').user

      const userWithOutDetail = await User.query()
        .where({id: user.id})
        .whereDoesntHave('user_detail', () => {})
        .first()
      if (!userWithOutDetail) throw new ExceptionWithCode('Account setup already done', 400)

      userWithOutDetail.useTransaction(trx)

      await userWithOutDetail.merge({isCompleted: true}).save()
      const userDetail = await userWithOutDetail.related('user_detail').create(input)

      let licenseDocuments: any[] = []
      for (let media of request.input('license_documents', [])) {
        licenseDocuments.push({
          path: media.path,
          instanceType: Attachment.TYPE.VET_LICENSE_DOCUMENT,
          mimeType: media.type,
        })
      }
      await userDetail.related('license_documents').createMany([...licenseDocuments])

      let specializations: any[] = []
      for (let specialization of request.input('vet_specializations', [])) {
        specializations.push({
          pet_type: specialization.pet_type
        })
      }
      await userDetail.related('vet_specializations').createMany([...specializations])


      return userDetail
    })

    return this.show(userDetail.id)
  }
}

export default new UserDetailRepo()
