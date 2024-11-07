// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import constants from 'Config/constants'
import {LucidModel} from '@ioc:Adonis/Lucid/Orm'
import {RequestContract} from '@ioc:Adonis/Core/Request'
import myHelpers from 'App/Helpers'
import Logger from '@ioc:Adonis/Core/Logger'
import Attachment from 'App/Models/Attachment'
import ExceptionWithCode from 'App/Exceptions/ExceptionWithCode'
import {HttpContext} from '@adonisjs/core/build/standalone'


export default class BaseRepo {
  model
  relations
  scopes

  constructor(model: LucidModel, relations: object, scopes: object = []) {
    this.model = model
    this.relations = relations
    this.scopes = scopes
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
    let query = this.model.query()
    for (let relation of [...this.relations, ...relations]) query.preload(relation)
    for (let scope of this.scopes) query.withScopes((scopeBuilder) => scopeBuilder[scope].call())
    if (pagination){
      return await query.orderBy(orderByColumn, orderByValue).paginate(page, perPage)
    }else{
      return await query.orderBy(orderByColumn, orderByValue)
    }
  }

  async store(input, request ?: RequestContract, instanceType?: number, deleteOldMedia = false, trx?: any) {

    /*
    * handling Single/Multiple File upload
    * NOTE: "media" key will be used to input file(s) and store in attachments table
    * NOTE: Media Type -> use for validation, need to mention mediaType in arguments [image, video, ....]
    * */


    let row = await this.model.create(input, {client: trx})
    if (request && request.file('media') && instanceType) {
      if (typeof instanceType == 'undefined') throw new Error("Instance type of media is not defined")
      this.uploadMedia(request, row.id, instanceType, deleteOldMedia)
    }
    return row
  }

  async show(id) {
    const ctx: any = HttpContext.get()
    const relations = ctx.request.input('relations',[])

    let query = this.model.query()
    for (let relation of [...this.relations, ...relations]) query.preload(relation)
    for (let scope of this.scopes) query.withScopes((scopeBuilder) => scopeBuilder[scope].call())
    return query.where({id}).firstOrFail()
  }

  async delete(id) {
    let row = await this.model.findOrFail(id)
    await row.delete()
  }

  async update(id: number, input, request ?: RequestContract, instanceType?: number, deleteOldMedia = false, trx?: any) {
    let row = await this.model.findOrFail(id)

    /*
    * handling Single/Multiple File upload
    * NOTE: "media" key will be used to input file(s) and store in attachments table
    * NOTE: Media Type -> use for validation, need to mention mediaType in arguments [image, video, ....]
    * */
    if (request && request.file('media') && instanceType) {
      if (typeof instanceType == 'undefined') throw new Error("Instance type of media is not defined")
      this.uploadMedia(request, row.id, instanceType, deleteOldMedia, trx)
    }

    if (trx) row.useTransaction(trx)
    return await row.merge(input).save()
  }

  async uploadMedia(request: RequestContract, instanceId: number, instanceType: number, removeOld = false, trx?: any, fileName = "media") {

    let pendingPromises = []
    let files: any = request.files(fileName)

    if (files.length <= 0)
      throw new Error('Media has no file, make sure to send it as an array!')

    /*
    * Media custom validation
    * */
    for (let file of files) {

      // @ts-ignore
      pendingPromises.push(myHelpers.uploadFile(file, `${Attachment.TYPE_TEXT[instanceType]}/`))
    }


    let uploadedFiles: any = await Promise.all(pendingPromises)

    /*
    * Delete old files
    * */

    if (removeOld) await Attachment.query().where({instanceType, instanceId}).delete()

    for (let uploadedFile of uploadedFiles) {

      await Attachment.create({
        instanceType: instanceType,
        instanceId: instanceId,
        mimeType: uploadedFile.type,
        path: uploadedFile.path,
        duration: uploadedFile.duration,
        thumbnail: uploadedFile.thumbnail,
      }, {client: trx})
    }

    // @ts-ignore
    Logger.info(myHelpers.logMsg(`Attachments Uploaded successfully!`))
  }

  fillables(exclude:string[] = []):any {
    let fillables = Object.values(this.model.$keys.attributesToColumns.keys)
    const defaultExclude = ['created_at','updated_at']
    exclude = [...exclude, ...defaultExclude]
    if(exclude.length > 0){
      fillables = fillables.filter((key:never)=>{
        return !exclude.includes(key)
      })
    }
    return fillables
  }

  async existsCheck(where, model:LucidModel, message = ''){
    const exists = await model.query().where(where).first()
    if (exists) throw new ExceptionWithCode(message || "Record already exist", 400)
  }
}
