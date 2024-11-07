import {column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import VetSpecialization from "App/Models/VetSpecialization";
import Attachment from "App/Models/Attachment";
import {DateTime} from "luxon";

export default class UserDetail extends CommonModel {

  static VET_TYPES = {
    DVM: 10,
    LVT: 20,
  }

  @column({isPrimary:true})
  public id: number
  @column()
  public about: string
  @column()
  public deaNumber: string
  @column()
  public nationalLicenseNumber: string
  @column()
  public regNumber: string
  @column()
  public stateLicense: string
  @column()
  public stateLicenseNumber: string
  @column()
  public userId: number
  @column()
  public vetType: number
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

  @hasMany(() => VetSpecialization)
  public vet_specializations: HasMany<typeof VetSpecialization>

  /*Multiple*/
  @hasMany(() => Attachment, {
    foreignKey: 'instanceId',
    onQuery: (query) => query.where({instanceType: Attachment.TYPE.VET_LICENSE_DOCUMENT}),
  })
  public license_documents: HasMany<typeof Attachment>

  /*
  * ######################### SCOPES ##########################
  * */



  /*
  * ######################### HOOKS ##########################
  * */
}
