// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseRepo from 'App/Repos/BaseRepo'
import User from 'App/Models/User'
import {RequestContract} from '@ioc:Adonis/Core/Request'
import Mail from '@ioc:Adonis/Addons/Mail'
import constants from 'Config/constants'
import Attachment from 'App/Models/Attachment'
import Database from '@ioc:Adonis/Lucid/Database'
import Role from "App/Models/Role";
import {HttpContext} from '@adonisjs/core/build/standalone'
import UserDetail from "App/Models/UserDetail";
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import SavedSearchRepo from "App/Repos/SavedSearchRepo";
import ExceptionWithCode from "App/Exceptions/ExceptionWithCode";
import PaypalService from "App/Helpers/PaypalService";
import TransactionRepo from "App/Repos/TransactionRepo";
import Transaction from "App/Models/Transaction";
import Appointment from "App/Models/Appointment";
import NotificationRepo from "App/Repos/NotificationRepo";
import Notification from "App/Models/Notification";
import {DateTime} from "luxon";
import moment from 'moment'

interface IGetUsersForAdminParams {
  roles: number[]
  start_date?: DateTime
  end_date?: DateTime
}

class UserRepo extends BaseRepo {
  model

  constructor() {
    const relations = ['roles']
    const scopes = []
    super(User, relations, scopes)
    this.model = User
  }



  async dashboardData() {


    const userRowData = await Database.query()
      .select(
        Database.raw('SUM(CASE WHEN role_user.role_id = ? THEN 0 ELSE 1 END) as total_users', [
          Role.TYPES.ADMIN,
        ]),
        Database.raw('SUM(CASE WHEN role_user.role_id = ? THEN 1 ELSE 0 END) as vet_count', [
          Role.TYPES.VET,
        ]),
        Database.raw('SUM(CASE WHEN role_user.role_id = ? THEN 1 ELSE 0 END) as pet_count', [
          Role.TYPES.PET,
        ])
      )
      .from('role_user')
      .innerJoin('users', 'role_user.user_id', 'users.id')
      .whereNull('users.deleted_at')
      .where('users.is_verified',true)
      .first()


    const appointmentRowData = await Database.query()
      .select(
        Database.raw('COUNT(*) as total_appointments'),
        Database.raw(
          'SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as pending_appointments',
          [Appointment.STATUS.PENDING]
        ),
        Database.raw(
          'SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as completed_appointments',
          [Appointment.STATUS.COMPLETED]
        ),
        Database.raw(
          'SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as confirmed_appointments',
          [Appointment.STATUS.CONFIRMED]
        ),
        Database.raw(
          'SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as rejected_appointments',
          [Appointment.STATUS.REJECTED]
        ),
      )
      .from('appointments')
      .whereNull('deleted_at')
      .first();

    const transactionRowData = await Database.query()
      .select(
        Database.raw(
          'SUM(CASE WHEN ref_type = ? THEN transactions.amount ELSE 0 END) as appointment_revenue',
          [Transaction.TYPES.SCHEDULE_APPOINTMENT]
        ),
        Database.raw(
          'SUM(CASE WHEN ref_type = ? THEN transactions.amount ELSE 0 END) as platform_revenue',
          [Transaction.TYPES.PLATFORM_CHECK]
        ),
        Database.raw(
          'SUM(CASE WHEN ref_type = ? THEN transactions.amount ELSE 0 END) as subscription_revenue',
          [Transaction.TYPES.SUBSCRIPTION]
        )
      )
      .from('transactions')
      .whereNull('deleted_at')
      .first();



    return {
      ...userRowData,
      ...appointmentRowData,
      ...transactionRowData
    }
  }

  async getUsersForAdmin(
    params: IGetUsersForAdminParams,
    orderByColumn = constants.ORDER_BY_COLUMN,
    orderByValue = constants.ORDER_BY_VALUE,
    page = 1,
    perPage = constants.PER_PAGE,
    pagination = true
  ) {
    const ctx: any = HttpContext.get()
    const relations = ctx.request.input('relations', [])
    const search = ctx.request.input('search', null)
    const upApproved = ctx.request.input('un_approved', false)


    let query = this.model.query().where('is_verified', true)

    if(upApproved) {
      query.whereHas('roles', (roleBuilder) => {
        roleBuilder.where('id', Role.TYPES.VET)
      }).where('is_approved',false)
    }

    if (search)
      query.where(function (subQuery) {
        subQuery.whereILike('full_name', `%${search}%`).orWhereILike('email', `%${search}%`)
      })

    if (params.roles.length > 0) {
      query.whereHas('roles', (roleBuilder) => {
        roleBuilder.whereIn('id', [...params.roles])
      })
    }

    if (params.start_date && params.end_date) {
      const startDate = moment(params.start_date.toISO()).format('YYYY-MM-DD')

      const endDate = moment(params.end_date.toISO()).add(1, 'days').format('YYYY-MM-DD')

      query.whereBetween('created_at', [startDate, endDate])
    }

    for (let relation of [...this.relations, ...relations]) query.preload(relation)
    for (let scope of this.scopes) query.withScopes((scopeBuilder) => scopeBuilder[scope].call())
    if (pagination) {
      return await query.orderBy(orderByColumn, orderByValue).paginate(page, perPage)
    } else {
      return await query.orderBy(orderByColumn, orderByValue)
    }
  }

  async getVets(
    orderByColumn = constants.ORDER_BY_COLUMN,
    orderByValue = constants.ORDER_BY_VALUE,
    page = 1,
    perPage = constants.PER_PAGE,
    pagination = true
  ) {
    const ctx: any = HttpContext.get()
    const relations = ctx.request.input('relations', [])
    const search = ctx.request.input('search', null)
    const latitude = ctx.request.input('latitude', null)
    const longitude = ctx.request.input('longitude', null)

    let query = this.model.query().where('is_completed', true).where('is_verified', true)

    query.whereHas('roles', (roleBuilder) => {
      roleBuilder.where('id', Role.TYPES.VET)
    })


    if (search) {
      SavedSearchRepo.store({text: search})

      query.where(function (subQuery) {
        subQuery.whereILike('full_name', `%${search}%`).orWhere('email', `%${search}%`)
      })
    }

    if (latitude && longitude) {
      const radiusQuery = `(ACOS(SIN(latitude * 0.0175) * SIN(${latitude} * 0.0175) + COS(latitude * 0.0175) * COS(${latitude} * 0.0175) * COS((${longitude} * 0.0175) - (longitude * 0.0175))) * 6371 <= ${constants.RADIUS_DISTANCE})`
      query.whereRaw(radiusQuery)
    }

    for (let relation of ['user_image', ...relations]) query.preload(relation)
    for (let scope of this.scopes) query.withScopes((scopeBuilder) => scopeBuilder[scope].call())
    if (pagination) {
      return await query.orderBy(orderByColumn, orderByValue).paginate(page, perPage)
    } else {
      return await query.orderBy(orderByColumn, orderByValue)
    }
  }


  async notificationToggle(
    ctx: HttpContextContract
  ) {
    const user: any = ctx.auth.user;

    return user.merge({
      pushNotification: ctx.request.input('push_notification')
    }).save()

  }

  async emergencyToggle(
    ctx: HttpContextContract
  ) {
    const user: any = ctx.auth.user;

    return user.merge({
      emergencyLocation: ctx.request.input('emergency_location')
    }).save()

  }

  async removePaypal(
    ctx: HttpContextContract
  ) {
    const user: any = ctx.auth.user;

    return user.merge({
      connectAccountId: null
    }).save()

  }

  async changeUserStatus(
    ctx: HttpContextContract
  ) {
    const user: any = await User.findOrFail(ctx.request.param('id'));

    return user.merge({
      isActive: !user.isActive
    }).save()

  }

  async approveVet(
    ctx: HttpContextContract
  ) {
    const vetId: number = ctx.request.input('vet_id');

    const vet: User = await User.findOrFail(vetId)

    return vet.merge({
      isApproved: true
    }).save()

  }

  // @ts-ignore
  async store(input, request?: RequestContract, instanceType?: number): Promise<void> {
    delete input.password_confirmation
    return super.store(input, request, Attachment.TYPE.USER);
  }

  async update(id: number, input, request?: RequestContract, _instanceType?: number, _deleteOldMedia: boolean = false, _trx?: any): Promise<any> {
    const user: User = await Database.transaction(async (_trx) => {
      const row: User = await super.update(id, input, request, _instanceType, _deleteOldMedia, _trx)
      await row.related('roles').sync([request?.input('role_id')]);
      return row
    })

    return this.show(user.id)
  }

  async updateVerificationCode(user, verification_code) {
    await this.model.query().where('id', user.id).update({verification_code});
  }

  async generateAndSendOTP(receiver, type) {
    /*Generate OTP*/
    let otp_code = Math.floor(1000 + Math.random() * 9000);
    // let otp_code = "0000"

    let user = await this.model.findByOrFail(type, receiver)
    await this.updateVerificationCode(user, otp_code)

    switch (type) {
      case 'email':
        /*Send Email*/
        await Mail.sendLater((message) => {
          message
            .from(constants.APP_NAME)
            .to(receiver)
            .subject(`OTP Code - ${constants.APP_NAME}`)
            .htmlView('emails/verification-code', {
              name: user.full_name,
              verification_code: otp_code
            })
        })
        break

      case 'phone':
      /*Implement Twilio here*/
    }

  }

  async socialLogin(request) {
    let input = request.only(['username', 'email', 'social_platform', 'client_id', 'token'])
    input.full_name = input.username;
    input.is_verified = 1;
    input.is_approved = 1;
    input.is_social_login = 1;
    input.password = Math.random().toString(36).substring(2, 15)
    let res = await super.store(input, request);
    if (request.input('media', null)) {
      await Attachment.updateOrCreate({
        //@ts-ignore
        instance_type: Attachment.TYPE.PROFILE_PICTURE,
        instance_id: res.id,
      }, {
        path: request.input('media'),
        //@ts-ignore
        instance_type: Attachment.TYPE.PROFILE_PICTURE,
        instance_id: res.id,
        mime_type: "url"
      })
    }
    return res;
  }

  async findByEmail(email) {
    return this.model.query().where('email', email).first();
  }

  async findSocialLogin(request) {
    return this.model.query().where({
      social_platform: request.input('social_platform'),
      client_id: request.input('client_id'),
    }).first();

  }

  async updateSocialProfile(user, request) {
    let input = request.only(['username', 'social_platform', 'client_id', 'token'])
    input.full_name = input.username
    await this.model.query().where('id', user.id).update(input)
    if (request.input('media', null)) {
      await Attachment.updateOrCreate({
        //@ts-ignore
        instance_type: Attachment.TYPE.PROFILE_PICTURE,
        instance_id: user.id,
      }, {
        path: request.input('media'),
        //@ts-ignore
        instance_type: Attachment.TYPE.PROFILE_PICTURE,
        instance_id: user.id,
        mime_type: "url"
      })
    }
  }

  async uploadPetHealthRecords(request) {
    await Database.transaction(async (trx) => {

      const ctx: any = HttpContext.get()
      const user = ctx.auth.use('api').user
      user.useTransaction(trx)

      await user.related('medical_records').query().delete()


      let medicalRecords: any[] = []
      for (let media of request.input('medical_records', [])) {
        medicalRecords.push({
          path: media.path,
          instanceType: Attachment.TYPE.PET_MEDICAL_RECORDS,
          mimeType: media.type,
        })
      }
      return  user.related('medical_records').createMany([...medicalRecords])
    })
  }

  async updateProfile(
    input,
    _request?: RequestContract,
    _instanceType?: number,
    _deleteOldMedia: boolean = false,
    _trx?: any
  ): Promise<any> {
    const userResponse: User = await Database.transaction(async (trx) => {
      const ctx: any = HttpContext.get()
      const user = ctx.auth.use('api').user
      user.useTransaction(trx)
      await user.load('roles')
      await user.load('user_detail')

      const isVet = user!.roles.find((role) => role.id === Role.TYPES.VET)

      const image = ctx.request.input('image_url', null)
      if (image) {
        const userImage: any = {
          path: image,

          instanceType: Attachment.TYPE.USER,
          mimeType: 'image',
        }
        await user
          .related('user_image')
          .updateOrCreate({instanceType: Attachment.TYPE.USER, instanceId: user.id}, userImage)
      }

      if (isVet) {

        const userDetail: UserDetail = await user.related('user_detail').updateOrCreate({userId: user.id}, {
          deaNumber: ctx.request.input('dea_number', null),
          vetType: ctx.request.input('vet_type', null),
          startTime: ctx.request.input('start_time', null),
          endTime: ctx.request.input('end_time', null)
        })
        await userDetail.related('vet_specializations').query().delete()
        let specializations: any[] = []
        for (let specialization of ctx.request.input('vet_specializations', [])) {
          specializations.push({
            pet_type: specialization.pet_type
          })
        }
        await userDetail.related('vet_specializations').createMany([...specializations])

        if(user?.user_detail?.deaNumber !== ctx.request.input('dea_number', null)) {

          const admin = await User.query()
            .where('email', constants.SEEDER_CONSTANTS.ADMIN_EMAIL)
            .firstOrFail()

          await NotificationRepo.sendPushNotificationToUser(
            admin.id,
            null,
            `${user.fullName} change DAE number please re-approve`,
            user.id,
            Notification.NOTIFICATION_REF_TYPE.USER_APPROVAL,
            { status: true }
          )

          await user.merge({
            isApproved: false
          }).save()
        }
      }

      await user.merge(input).save()

      return user
    })

    return this.show(userResponse.id)
  }

  async vetPlatformCheckout() {
    const user: User = await Database.transaction(async (trx) => {

      const ctx: any = HttpContext.get()
      const user = ctx.auth.use('api').user

      if(user.platformCheckoutStatus) throw new ExceptionWithCode('Platform checkout already done',400)

      let payment_method = ctx.request.input('payment_method')
      let paypal_pay = ctx.request.input('paypal_pay', false)

      if (!paypal_pay && !user.customerId) throw new ExceptionWithCode('Please add your card first', 400)

      const transaction = await PaypalService.charge(user.customerId, payment_method, 100, paypal_pay)

      user.platformCheckoutStatus = true
      user.useTransaction(trx)
      await user.save()

      await TransactionRepo.saveTransaction({
        refId: user.id,
        refType: Transaction.TYPES.PLATFORM_CHECK,
        amount: 100,
        gatewayTransaction: transaction.transaction,
        trx,
        type: Transaction.TRANSACTION_TYPES.IN
      }, user.id)


      return user
    })

    return this.show(user.id)
  }


  async deleteUserAccount() {
    await Database.transaction(async (trx) => {
      const ctx: any = HttpContext.get()
      const user = ctx.auth.use('api').user


      const appointmentExist = await Appointment.query().where('user_id',user.id).orWhere('vet_id',user.id).whereIn('status',[Appointment.STATUS.STARTED,Appointment.STATUS.CONFIRMED,Appointment.STATUS.PENDING]).first()

      if(appointmentExist) throw new ExceptionWithCode('You have active appointment(s) account can not be deleted.',400)

      user.useTransaction(trx)


      if (user.isSocialLogin) {
        await user.related('social_accounts').query().delete()
      }

      await user.delete()

    })
  }
}

/*Create a singleton instance*/
export default new UserRepo()
