import {beforeSave, column, HasMany, hasMany, HasOne, hasOne, ManyToMany, manyToMany,} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import CommonModel from 'App/Models/CommonModel'
import Role from 'App/Models/Role'
import Attachment from "App/Models/Attachment";
import UserDetail from "App/Models/UserDetail";
import UserPet from "App/Models/UserPet";
import UserAddress from "App/Models/UserAddress";

export default class User extends CommonModel {
  public serializeExtras = true

  static PROFILE_COMPLETE_STATUS = {
    COMPLETED : 10
  }

  static DEVICE_TYPES = {
    WEB: 'web',
    MOBILE: 'mobile'
  }

  /*For pos notification purpose*/
  static PLATFORM = {
    IOS: 'ios',
    ANDROID: 'android',
    WEB: 'web'
  }


  @column({isPrimary: true})
  public id: number

  @column()
  public fullName: string

  @column()
  public email: string

  @column({
    serializeAs: null
  })
  public password: string

  @column()
  public isVerified: boolean

  @column()
  public isCompleted: boolean

  @column()
  public phone: string

  @column()
  public alternatePhone: string

  @column()
  public isSocialLogin: boolean

  @column()
  public isApproved: boolean

  @column()
  public pushNotification: number

  @column()
  public latitude: number

  @column()
  public longitude: number

  @column()
  public address: string

  @column()
  public emergencyLocation: boolean

  @column()
  public sharePetRecord: boolean

  @column()
  public accessPharmacy: boolean

  @column()
  public trialAvailed: boolean

  @column()
  public customerId: string

  @column()
  public platformCheckoutStatus: boolean

  @column()
  public connectAccountId: string

  @column()
  public isActive: boolean



  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }


  //Many To Many Role
  @manyToMany(() => Role,{
    onQuery: query => query.preload('permissions')
  })
  public roles: ManyToMany<typeof Role>

  @hasOne(() => Attachment, {
    foreignKey: 'instanceId',
    onQuery: (query) => query.where({instanceType: Attachment.TYPE.USER}).orderBy('id', 'desc'),
  })
  public user_image: HasOne<typeof Attachment>

  /*Multiple*/
  @hasMany(() => Attachment, {
    foreignKey: 'instanceId',
    onQuery: (query) => query.where({instanceType: Attachment.TYPE.PET_MEDICAL_RECORDS}),
  })
  public medical_records: HasMany<typeof Attachment>

  /*Multiple*/
  @hasMany(() => UserPet)
  public user_pets: HasMany<typeof UserPet>

  //Has One User Detail
  @hasOne(() => UserDetail,{
    onQuery: (query) => query.preload('vet_specializations').preload('license_documents'),
  })
  public user_detail: HasOne<typeof UserDetail>

  /*Multiple*/
  @hasMany(() => UserAddress)
  public user_addresses: HasMany<typeof UserAddress>

  /*
  * ######################### SCOPES ##########################
  * */


  /*
  * ######################### HOOKS ##########################
  * */

}
