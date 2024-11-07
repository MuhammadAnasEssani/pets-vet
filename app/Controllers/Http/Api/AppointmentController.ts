import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import AppointmentRepo from "App/Repos/AppointmentRepo";
import AppointmentValidator from "App/Validators/AppointmentValidator";
import Attachment from "App/Models/Attachment";
import UpdateAppointmentStatusValidator from "App/Validators/UpdateAppointmentStatusValidator";
import SendAppointmentPayoutAlertValidator from "App/Validators/SendAppointmentPayoutAlertValidator";
import {rules, schema, validator} from "@ioc:Adonis/Core/Validator";
import PayoutAppointmentValidator from "App/Validators/PayoutAppointmentValidator";
import Appointment from "App/Models/Appointment";
import TransactionRepo from "App/Repos/TransactionRepo";
import Transaction from "App/Models/Transaction";
import StartAppointmentMeetingValidator from 'App/Validators/StartAppointmentMeetingValidator';
import Database from "@ioc:Adonis/Lucid/Database";
import {DateTime} from "luxon";
import constants from "Config/constants";
import Role from "App/Models/Role";
import KJUR from 'jsrsasign'
import Env from "@ioc:Adonis/Core/Env";
import NotificationRepo from "App/Repos/NotificationRepo";
import Notification from "App/Models/Notification";

const crypto = require('crypto')

export default class AppointmentController extends ApiBaseController {

  constructor() {
    super(AppointmentRepo)
  }

  async index(ctx: HttpContextContract) {

    const UserValidator = schema.create({
      start_date: schema.date.optional({
        format: 'iso',
      }),
      end_date: schema.date.optional({
        format: 'iso',
      }),
      roles: schema.array.optional().members(
        schema.number([
          rules.exists({
            table: 'roles',
            column: 'id',
            where: {
              deleted_at: null,
            },
            whereNot: {
              id: Role.TYPES.ADMIN,
            },
          }),
        ])
      ),
      pagination: schema.boolean.optional(),
    })
    const validatedParams = await ctx.request.validate({
      schema: UserValidator,
      reporter: validator.reporters.api,
      messages: {
        'start_date.date.format': 'Invalid start date format',
        'end_date.date.format': 'Invalid end date format',
        'start_date.required': 'Start date must be provided',
        'end_date.required': 'End date must be provided',
      },
    })

    const data = {
      start_date: validatedParams?.start_date || null,
      end_date: validatedParams?.end_date || null,
    }

    let pagination = validatedParams?.pagination
    let page = ctx.request.input('page', 1)
    let perPage = ctx.request.input('per-page', constants.PER_PAGE)
    let orderByColumn = ctx.request.input('order-column', constants.ORDER_BY_COLUMN)
    let orderByValue = ctx.request.input('order', constants.ORDER_BY_VALUE)

    let rows = await this.repo.getAppointments(data,orderByColumn, orderByValue, page, perPage,pagination)
    return this.apiResponse('Records fetched successfully', rows)
  }

  public async getMonthlyAppointments() {
    // Get the current date
    const now = DateTime.now()

    // Get the date for one year ago
    const oneYearAgo = now.minus({ year: 1 })

    // Execute the query using the AdonisJS query builder
    const monthlyAppointments = await Database
      .from('appointments')
      .where('appointment_date', '>=', oneYearAgo.toSQLDate())
      .where('status', Appointment.STATUS.COMPLETED)
      .whereNull('deleted_at')
      .andWhere('appointment_date', '<', now.toSQLDate())
      .select(Database.raw("DATE_FORMAT(appointment_date, '%M %y') AS month"))
      .count('* as appointment_count')
      .groupBy('month')
      .orderBy('month', 'asc')

    // Generate all months from one year ago to now (last 12 months)
    const allMonths : any = []
    for (let i = 0; i < 12; i++) {
      allMonths.push(now.minus({ months: i }).toFormat('MMMM yy'))
    }
    allMonths.reverse() // Ensure months are from oldest to newest

    // Initialize the final result array with zeros for each month
    const monthlyData = allMonths.map((month) => {
      const appointment = monthlyAppointments.find((item) => item.month === month)
      return {
        month,
        appointment_count: appointment ? appointment.appointment_count : 0
      }
    })
    return this.apiResponse('Record fetch Successfully', monthlyData)

  }

  async createMeeting(ctx: HttpContextContract) {
    await super.validateBody(ctx,StartAppointmentMeetingValidator)
    let row = await AppointmentRepo.createMeeting()
    return this.apiResponse('Record Added Successfully', row)
  }

  async store(ctx: HttpContextContract, instanceType?: number) {
    await super.validateBody(ctx,AppointmentValidator)
    let input = ctx.request.only(this.repo.fillables(['status']))
    let row = await AppointmentRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
    return this.apiResponse('Record Added Successfully', row)
  }

  async update(ctx: HttpContextContract, instanceType?: number): Promise<{ data: any; message: string; status: boolean }> {
    await super.validateBody(ctx,AppointmentValidator)
    return super.update(ctx, instanceType)
  }

  async updateStatus(
    ctx: HttpContextContract
  ): Promise<{data: any; message: string; status: boolean}> {
    await super.validateBody(ctx, UpdateAppointmentStatusValidator)
    const res = await this.repo.updateStatus(ctx.request.param('id'), ctx)
    return this.apiResponse('Status updated successfully!', res)
  }

  async zoomWebhook({request,response}) {
    console.log(request,"request")
    // Handle different event types using switch case
    switch (request.requestBody.event) {
      case 'endpoint.url_validation':
        const hashForValidate = crypto.createHmac('sha256', Env.get('ZOOM_SECRET_KEY')).update(request.requestBody.payload.plainToken).digest('hex')
        console.log('Received notification:', {
          "plainToken": request.requestBody.payload.plainToken,
          "encryptedToken": hashForValidate
        });

        response.status(200)
          .json({
            "plainToken": request.requestBody.payload.plainToken,
            "encryptedToken": hashForValidate
          })
        break;
      case 'meeting.ended':

        const appointmentExist = await Appointment.query().where('zoom_meeting_id',request.requestBody.payload.object.id).where('status', Appointment.STATUS.STARTED).first()
        if(appointmentExist) {
          const meetingSummary = await AppointmentRepo.getMeetingSummary(request.requestBody.payload.object.uuid);
          console.log(meetingSummary.data,"meetingSummary")

          await appointmentExist.merge({
            status: Appointment.STATUS.COMPLETED
          }).save()

        }

        break;

      case 'session.started': {

        const appointmentExist = await Appointment.query().where('id', request.requestBody.payload.object.session_name).where('status', Appointment.STATUS.CONFIRMED).first()
        if (appointmentExist) {

          await appointmentExist.merge({
            status: Appointment.STATUS.STARTED
          }).save()

          NotificationRepo.sendPushNotificationToUser(
            appointmentExist.userId,
            null,
            "Appointment started",
            appointmentExist.id,
            Notification.NOTIFICATION_REF_TYPE.APPOINTMENT_STARTED,
            { status: true }
          )

        }

        break;
      }
      case 'session.ended': {

        const appointmentExist = await Appointment.query().where('id', request.requestBody.payload.object.session_name).where('status', Appointment.STATUS.STARTED).first()
        if (appointmentExist) {

          await appointmentExist.merge({
            status: Appointment.STATUS.COMPLETED
          }).save()

        }

        break;
      }
      // Add cases for other event types as needed
      // case 'some_other_event':
      //     handleOtherEvent(req, res);
      //     break;
      default:
        console.log('Unhandled event:', response.requestBody.event);
        response.status(200).json({ message: 'Event received' });
    }
  }

  async sendPayoutAppointmentAlert(
    ctx: HttpContextContract
  ): Promise<{data: any; message: string; status: boolean}> {
    await super.validateBody(ctx, SendAppointmentPayoutAlertValidator)
    await this.repo.sendPayoutAppointmentAlert()
    return this.apiResponse('Alert send successfully!')
  }

  async payoutAppointment(
    ctx: HttpContextContract
  ): Promise<{data: any; message: string; status: boolean}> {
    await super.validateBody(ctx, PayoutAppointmentValidator)
    const res = await this.repo.payoutAppointment()
    return this.apiResponse('Payout request sent',res)
  }

  async appointmentStats(
    ctx: HttpContextContract
  ): Promise<{data: any; message: string; status: boolean}> {
    const AppointmentStatsValidator = schema.create({
      start_date: schema.date.optional({
        format: 'iso',
      }),
      end_date: schema.date.optional({
        format: 'iso',
      }),
    })
    const validatedParams = await ctx.request.validate({
      schema: AppointmentStatsValidator,
      reporter: validator.reporters.api,
      messages: {
        'start_date.date.format': 'Invalid start date format',
        'end_date.date.format': 'Invalid end date format',
        'start_date.required': 'Start date must be provided',
        'end_date.required': 'End date must be provided',
      }
    })

    const data = {
      start_date: validatedParams?.start_date,
      end_date: validatedParams?.end_date,
    }
    const res = await this.repo.appointmentStats(data)
    return this.apiResponse('Record Added Successfully',res)
  }

  async payoutWebHook({request,response}) {
    let input = request.all()

    switch (input.event_type) {
      case "PAYMENT.PAYOUTS-ITEM.SUCCEEDED":
        const senderItemId = input?.resource?.payout_item?.sender_item_id
        const appointmentId = senderItemId.split("-")[0]
        const appointment = await Appointment.query().where('payout_status',Appointment.PAYOUT_STATUS.PENDING).where('id',appointmentId).first()
        if(!appointment) {
          return
        }
        const amount = input?.resource?.payout_item?.amount?.value

        await appointment.merge({
          payoutStatus: Appointment.PAYOUT_STATUS.COMPLETED
        }).save()

        await TransactionRepo.saveTransaction({
          refId: appointment.id,
          refType: Transaction.TYPES.PAYOUT_APPOINTMENT,
          amount: amount,
          gatewayTransaction: input?.resource,
          type: Transaction.TRANSACTION_TYPES.OUT
        }, appointment.vetId)

        NotificationRepo.sendPushNotificationToUser(
          appointment.vetId,
          null,
          `Payment received`,
          appointment.id,
          Notification.NOTIFICATION_REF_TYPE.APPOINTMENT_PAYOUT_SUCCESS,
          { status: true }
        )

        break;
      case "PAYMENT.PAYOUTS-ITEM.FAILED":

        break;
      case "PAYMENT.PAYOUTS-ITEM.UNCLAIMED":

        break
      default:

        break;

    }

    response.status(200).json({ message: 'Event received' });
  }

  async generateJwt(ctx: HttpContextContract) {
    await super.validateBody(ctx,StartAppointmentMeetingValidator)

    const user = ctx.auth.use('api').user
    await user!.load('roles')

    const isVet = user!.roles.find((role) => role.id === Role.TYPES.VET)

    const appointmentId = ctx.request.input('appointment_id')

    const appointment = await Appointment.findOrFail(appointmentId)

    const iat = Math.round(new Date().getTime() / 1000) - 30
    const exp = iat + 60 * 60 * 2
    const oHeader = { alg: 'HS256', typ: 'JWT' }

    const oPayload = {
      app_key: Env.get('ZOOM_SDK_KEY'),
      tpc: JSON.stringify(appointment.id),
      role_type: isVet ? 1 : 0,
      user_identity: user,
      version: 1,
      iat: iat,
      exp: exp,
      cloud_recording_option: 1
    }

    const sHeader = JSON.stringify(oHeader)
    const sPayload = JSON.stringify(oPayload)
    const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, Env.get('ZOOM_SDK_SECRET'))

    return this.apiResponse('Record Added Successfully', {
      jwt: sdkJWT
    })

  }

}
