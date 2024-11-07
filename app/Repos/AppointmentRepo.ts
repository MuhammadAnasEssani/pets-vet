import BaseRepo from 'App/Repos/BaseRepo'
import Appointment from "App/Models/Appointment";
import {RequestContract} from "@ioc:Adonis/Core/Request";
import Slot from "App/Models/Slot";
import moment from "moment";
import constants from "Config/constants";
import {HttpContext} from "@adonisjs/core/build/standalone";
import Role from "App/Models/Role";
import ExceptionWithCode from "App/Exceptions/ExceptionWithCode";
import InvalidRoleAccess from "App/Exceptions/InvalidRoleAccess";
import NotificationRepo from "App/Repos/NotificationRepo";
import Notification from "App/Models/Notification";
import User from "App/Models/User";
import Env from "@ioc:Adonis/Core/Env";
import Database from '@ioc:Adonis/Lucid/Database'
import SavedSearchRepo from "App/Repos/SavedSearchRepo";
import PaypalService from "App/Helpers/PaypalService";
import TransactionRepo from "App/Repos/TransactionRepo";
import Transaction from "App/Models/Transaction";
import Setting from "App/Models/Setting";
import {DateTime} from "luxon";

const axios = require('axios');
const zoomApiBaseUrl = 'https://api.zoom.us/v2';
const btoa = require("btoa");

interface IGetAppointmentsParams {
  start_date?: DateTime
  end_date?: DateTime
}

class AppointmentRepo extends BaseRepo {
  model

  constructor() {
    const relations = []
    const scopes = []
    super(Appointment, relations, scopes)
    this.model = Appointment
  }

  getAccessToken = async () => {
    const base_64 = btoa(Env.get('ZOOM_CLIENT_ID') + ":" + Env.get('ZOOM_CLIENT_SECRET'));

    const response = await axios({
      method: "POST",
      url:
        "https://zoom.us/oauth/token?grant_type=account_credentials&account_id=" +
        `${Env.get('ZOOM_ACCOUNT_ID')}`,
      headers: {
        Authorization: "Basic" + `${base_64} `,
      },
    });
    return response.data.access_token;
  };

  async getAppointments(
    params: IGetAppointmentsParams,
    orderByColumn = constants.ORDER_BY_COLUMN,
    orderByValue = constants.ORDER_BY_VALUE,
    page = 1,
    perPage = constants.PER_PAGE,
    pagination=true
  ) {
    const ctx: any = HttpContext.get()
    const user = ctx.auth.use('api').user
    const status = ctx.request.input('status', [])
    const payoutStatus = ctx.request.input('payout_status', [])
    const date = ctx.request.input('date',null)
    await user.load('roles')
    const isPetOwner = user!.roles.find((role) => role.id === Role.TYPES.PET)
    const isVet = user!.roles.find((role) => role.id === Role.TYPES.VET)
    const search = ctx.request.input('search', null)

    const relations = ctx.request.input('relations',[])
    let query = this.model.query()

    if(isVet) {
      query.where('vet_id',user.id)
    }else if (isPetOwner) {
      query.where('user_id',user.id)
    }

    if(payoutStatus.length > 0) {
      query.whereIn('payout_status',payoutStatus)
    }

    if(status.length > 0) {
      query.whereIn('status',status)
    }

    if(date) {
      const dateFormatted = moment(date).format('YYYY-MM-DD')
      query.whereRaw('DATE(appointment_date) = ?', [dateFormatted])
    }

    if (search) {
      SavedSearchRepo.store({text: search})
      if(isVet) {
        query.where(function (subQuery) {
          subQuery.whereHas('user', (userQB) => {
            userQB.whereILike('full_name', `%${search}%`).orWhereILike('email', `%${search}%`)
          })
        })
      }else if (isPetOwner) {
        query.where(function (subQuery) {
          subQuery.whereHas('vet', (userQB) => {
            userQB.whereILike('full_name', `%${search}%`).orWhereILike('email', `%${search}%`)
          })
        })
      }else {
        query.where(function (subQuery) {
          subQuery.whereHas('user', (userQB) => {
            userQB.whereILike('full_name', `%${search}%`).orWhereILike('email', `%${search}%`)
          })
        }).orWhere(function (subQuery) {
          subQuery.whereHas('vet', (userQB) => {
            userQB.whereILike('full_name', `%${search}%`).orWhereILike('email', `%${search}%`)
          })
        })
      }

    }

    if (params.start_date && params.end_date) {
      const startDate = moment(params.start_date.toISO()).format('YYYY-MM-DD')

      const endDate = moment(params.end_date.toISO()).add(1, 'days').format('YYYY-MM-DD')

      query.whereBetween('appointment_date', [startDate, endDate])
    }

    for (let relation of [...this.relations, ...relations]) query.preload(relation)
    for (let scope of this.scopes) query.withScopes((scopeBuilder) => scopeBuilder[scope].call())
    if (pagination){
      return await query.orderBy(orderByColumn, orderByValue).paginate(page, perPage)
    }else{
      return await query.orderBy(orderByColumn, orderByValue)
    }
  }

  async store(input, request : RequestContract, _instanceType?: number, _deleteOldMedia = false, trx?: any) {
    const ctx: any = HttpContext.get()

    const user = ctx.auth.use('api').user
    input.appointment_date = moment(request.input('appointment_date').toISO()).format('YYYY-MM-DD')


    const slot = await Slot.findOrFail(request.input('slot_id'))

    input.duration = slot.duration
    input.amount = slot.amount

    const setting = await Setting.query().first()

    if(setting) {
      input.admin_cut = (slot.amount * setting.adminCut) / 100; // Calculate admin cut based on percentage

    }

    let payment_method = ctx.request.input('payment_method')
    let paypal_pay = ctx.request.input('paypal_pay', false)

    if (!paypal_pay && !user.customerId) throw new ExceptionWithCode('Please add your card first', 400)

    const transaction = await PaypalService.charge(user.customerId, payment_method, input.amount, paypal_pay,false)


    input.transaction_id = transaction.transaction.id


    const appointment = await this.model.create(input, {client: trx})

    NotificationRepo.sendPushNotificationToUser(
      appointment.vetId,
      null,
      `New appointment request from ${user.fullName}.`,
      appointment.id,
      Notification.NOTIFICATION_REF_TYPE.APPOINTMENT_REQUEST,
      { status: true }
    )

    return appointment

  }

  async updateStatus(id: number) {
    const ctx: any = HttpContext.get()

    const user = ctx.auth.use('api').user
    const status = ctx.request.input('status')
    let previousExpectedStatus: number[] = []

    let row = await Appointment.query().where('id',id).preload('user').preload('vet').firstOrFail()

    let notificationBody = ""
    let toUserId

    // @ts-ignore
    const appointmentDate = moment(row.appointmentDate).format('YYYY-MM-DD')

    const appointmentStartTime = moment(row.startTime.toISO()).format('HH:mm:ss')


    switch (status) {
      case Appointment.STATUS.CONFIRMED:
      case Appointment.STATUS.REJECTED:
        if(row.vetId !== user.id) throw new InvalidRoleAccess()
        previousExpectedStatus = [Appointment.STATUS.PENDING]
        notificationBody = `Your appointment with ${row.vet.fullName} has been ${Appointment.STATUS_TEXT[status]} for ${appointmentDate} at ${appointmentStartTime}.`
        toUserId = row.userId
        break
      case Appointment.STATUS.CANCELLED:
        if(row.vetId !== user.id && row.userId !== user.id) throw new InvalidRoleAccess()
        // if(row.status === Appointment.STATUS.CONFIRMED) {
        //   const currentTime = moment()
        //   const isoDate = moment(row.appointmentDate).format('YYYY-MM-DD')
        //   const startTime = row.startTime.toFormat('HH:mm:ss')
        //   const appointmentDateTime = moment(`${isoDate} ${startTime}`)
        //   const twoHoursBeforeAppointment = appointmentDateTime.subtract(2, 'hours')
        //   if (currentTime.isAfter(twoHoursBeforeAppointment))
        //     throw new ExceptionWithCode('Cannot cancel the appointment within 2 hours of the start time', 400)
        // }

        previousExpectedStatus = [Appointment.STATUS.CONFIRMED,Appointment.STATUS.PENDING]

        await user.load('roles')
        const isPetOwner = user!.roles.find((role) => role.id === Role.TYPES.PET)
        const isVet = user!.roles.find((role) => role.id === Role.TYPES.VET)
        if(isVet) {
          notificationBody = `Your appointment with ${row.vet.fullName} scheduled for ${appointmentDate} on ${appointmentStartTime} has been canceled.`
          toUserId = row.userId
        }else if (isPetOwner) {
          notificationBody = `${row.user.fullName} has canceled the appointment scheduled for ${appointmentDate} on ${appointmentStartTime}.`
          toUserId = row.vetId
        }

        break
      default:
        break
    }

    if (!previousExpectedStatus.includes(row.status))
      throw new ExceptionWithCode(
        `Current status should be ${Appointment.STATUS_TEXT[previousExpectedStatus[0]]} for this action`,
        400
      )

    if(status === Appointment.STATUS.CONFIRMED) {
      const transaction = await PaypalService.submitForSettlement(row.transactionId)

      await TransactionRepo.saveTransaction({
        refId: row.id,
        refType: Transaction.TYPES.SCHEDULE_APPOINTMENT,
        amount: row.amount,
        gatewayTransaction: transaction,
        type: Transaction.TRANSACTION_TYPES.IN
      }, row.userId)
    }

    if(status === Appointment.STATUS.CANCELLED) {
      let amount = row.amount
      if(row.status === Appointment.STATUS.CONFIRMED ) {
        if(row.userId === user.id) {
          const currentTime = moment()
          const isoDate = moment(row.appointmentDate).format('YYYY-MM-DD')
          const startTime = row.startTime.toFormat('HH:mm:ss')
          const appointmentDateTime = moment(`${isoDate} ${startTime}`)
          const oneHoursBeforeAppointment = appointmentDateTime.subtract(1, 'hours')
          if (currentTime.isAfter(oneHoursBeforeAppointment))
            amount -= amount * 0.10
        }

        const refund = await PaypalService.refund(row.transactionId, amount)

        if(refund.success) {
          await TransactionRepo.saveTransaction({
            refId: row.id,
            refType: Transaction.TYPES.REFUND_APPOINTMENT,
            amount: amount,
            gatewayTransaction: refund.transaction,
            type: Transaction.TRANSACTION_TYPES.OUT
          }, user.id)
        }else {
          throw new ExceptionWithCode(refund.message ,400)
        }
      }
    }


    row.status = status
    await row.save()

    NotificationRepo.sendPushNotificationToUser(
      toUserId,
      null,
      notificationBody,
      row.id,
      Notification.NOTIFICATION_REF_TYPE.APPOINTMENT_STATUS_CHANGE,
      { status: true }
    )

    return row
  }
  async createMeeting() {
    const ctx: any = HttpContext.get()
    const user = ctx.auth.use('api').user

    const appointmentId = ctx.request.input('appointment_id')

    const appointment = await Appointment.findOrFail(appointmentId)

    if (appointment.vetId !== user.id) throw new InvalidRoleAccess()


    // const accessToken = await this.getAccessToken();
    //
    // const startDate = moment(appointment.appointmentDate).format('YYYY-MM-DD'); // Extract and format appointment date
    // const startTime = moment(appointment.startTime.toISO()).format('HH:mm:ss'); // Extract and format start time

// // Combine date and time into a single DateTime string
//     const formattedStartTime = `${startDate}T${startTime}`;
//     const response = await axios.post(`${zoomApiBaseUrl}/users/me/meetings`, {
//       topic : "Vet Appointment",
//       type: 2,
//       start_time : formattedStartTime,
//       duration : appointment.duration,
//       settings: {
//         join_before_host: true,
//         participant_video: true,
//         host_video: true,
//         auto_start_meeting_summary: true,
//         auto_recording: "cloud"
//       }
//     }, {
//       headers: {
//         'Authorization': `Bearer ${accessToken}`
//       }
//     });

    // return response.data
    await appointment.merge({
      // joinUrl: response.data.join_url,
      // startUrl: response.data.start_url,
      status: Appointment.STATUS.STARTED,
      // zoomMeetingId: response.data.id
    }).save()

    return this.show(appointment.id)
  }

  async getMeetingSummary(meetingId: string) {
    const accessToken = await this.getAccessToken();

    // Check if the meetingId needs to be double-encoded
    let encodedMeetingId = encodeURIComponent(meetingId);
    if (meetingId.startsWith('/') || meetingId.includes('//')) {
      encodedMeetingId = encodeURIComponent(encodedMeetingId);
    }
    const url = `${zoomApiBaseUrl}/meetings/${encodedMeetingId}/meeting_summary`

    return  axios.get(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })


  }

  async sendPayoutAppointmentAlert() {
    const ctx: any = HttpContext.get()

    const user = ctx.auth.use('api').user
    const appointmentId = ctx.request.input('appointment_id')
    const appointment = await Appointment.findOrFail(appointmentId)
    const admin = await User.query()
      .where('email', constants.SEEDER_CONSTANTS.ADMIN_EMAIL)
      .firstOrFail()

    await NotificationRepo.sendPushNotificationToUser(
      admin.id,
      null,
      `This is a gentle reminder to proceed with the release of the consultation amount of ${appointment.amount} to ${user.fullName}`,
      appointment.id,
      Notification.NOTIFICATION_REF_TYPE.PAYOUT_ALERT,
      { status: true }
    )

  }

  async payoutAppointment() {
    const ctx: any = HttpContext.get()

    const appointmentId = ctx.request.input('appointment_id')
    const appointment = await Appointment.findOrFail(appointmentId)

    const vet = await User.findOrFail(appointment.vetId)

    if(!vet.connectAccountId) throw new ExceptionWithCode('Account not connected yet!',400)

    const amount = appointment.amount - appointment.adminCut
    return  PaypalService.payout(appointment.id,vet.connectAccountId,amount);


  }

  async appointmentStats(params: any) {
    const ctx: any = HttpContext.get()

    const user = ctx.auth.use('api').user

    let appointmentQuery =  Appointment.query()
      .select(
        Database.raw('SUM(amount - admin_cut) as totalEarnings'),
        Database.raw('COUNT(CASE WHEN status = ? THEN id END) as totalCompletedAppointments', [Appointment.STATUS.COMPLETED]),
        Database.raw('SUM(CASE WHEN payout_status = ? THEN (amount - admin_cut) ELSE 0 END) as completedEarnings', [Appointment.PAYOUT_STATUS.COMPLETED]),
        Database.raw('SUM(CASE WHEN payout_status = ? THEN (amount - admin_cut) ELSE 0 END) as pendingEarnings', [Appointment.PAYOUT_STATUS.PENDING])
      )
      .where('vet_id',user.id)

    if(params.start_date && params.end_date) {
      const startDate = moment(params.start_date.toISO()).format('YYYY-MM-DD')
      const endDate = moment(params.end_date.toISO()).add(1, 'days').format('YYYY-MM-DD')
      appointmentQuery.whereBetween('appointment_date', [startDate, endDate])

    }

    return appointmentQuery.first()

  }


}

export default new AppointmentRepo()
