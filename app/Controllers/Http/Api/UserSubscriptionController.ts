import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import UserSubscriptionRepo from "App/Repos/UserSubscriptionRepo";
import UserSubscriptionValidator from "App/Validators/UserSubscriptionValidator";
import Attachment from "App/Models/Attachment";
import ExceptionWithCode from "App/Exceptions/ExceptionWithCode";
import Plan from "App/Models/Plan";
import UserSubscription from "App/Models/UserSubscription";
import User from "App/Models/User";
import moment from 'moment'
import TransactionRepo from "App/Repos/TransactionRepo";
import Transaction from "App/Models/Transaction";


export default class UserSubscriptionController extends ApiBaseController {

  constructor() {
    super(UserSubscriptionRepo)
  }

  async store(ctx: HttpContextContract, instanceType?: number) {
    await super.validateBody(ctx,UserSubscriptionValidator)
    let input = ctx.request.only(this.repo.fillables())
    let row = await UserSubscriptionRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
    return this.apiResponse('Record Added Successfully', row)
  }

  async update(ctx: HttpContextContract, instanceType?: number): Promise<{ data: any; message: string; status: boolean }> {
    await super.validateBody(ctx,UserSubscriptionValidator)
    return super.update(ctx, instanceType)
  }

  // Webhook handler for all events
  async revenueCatWebhook({request}) {
    const event = request.input('event', null)
    const eventType = event.type

    if (!event) throw new ExceptionWithCode('Event is required', 400)

    const currentUser = await User.findOrFail(event.original_app_user_id)

    const subscriptionExist = await UserSubscription.query()
      .where('user_id', currentUser.id)
      .first()

    const plan = await Plan.query().where('product_id', event.product_id).first()

    if (!plan) throw new ExceptionWithCode('Plan not found', 400)
    const data: any = {
      planId: plan.id,
      subscriptionId: event.transaction_id,
      userId: event.original_app_user_id,
      subscriptionStartDate: moment(event.purchased_at_ms).format('YYYY-MM-DD HH:mm:ss'),
      subscriptionNextPayment: moment(event.expiration_at_ms).format('YYYY-MM-DD HH:mm:ss'),
      subscriptionPaymentFailed: false,
    }
    // Handle different event types
    switch (eventType) {
      case 'INITIAL_PURCHASE':
        if (subscriptionExist) {
          throw new ExceptionWithCode('Subscription already exist against this user', 400)
        }

        if (currentUser?.trialAvailed && event.period_type == 'TRIAL') {
          throw new ExceptionWithCode('User already availed free trial', 400)
        }

        await UserSubscription.create(data)

        if (event.period_type == 'TRIAL') {
          await currentUser
            .merge({
              trialAvailed: true,
            })
            .save()
        } else {
          await TransactionRepo.saveWebHookTransaction(
            {
              refId: plan.id,
              refType: Transaction.TYPES.SUBSCRIPTION,
              amount: event.price * 100,
              gatewayTransaction: event,
              type: Transaction.TRANSACTION_TYPES.IN
            },
            currentUser.id
          )
        }

        console.log('Received initial purchase event:', event)
        break
      case 'RENEWAL':
        if (!subscriptionExist) {
          await UserSubscription.create(data)
        }else {
          await subscriptionExist.merge(data).save()
        }

        await TransactionRepo.saveWebHookTransaction(
          {
            refId: plan.id,
            refType: Transaction.TYPES.SUBSCRIPTION,
            amount: event.price * 100,
            gatewayTransaction: event,
            type: Transaction.TRANSACTION_TYPES.IN
          },
          currentUser.id
        )
        console.log('Received renewal event:', event)
        break
      case 'CANCELLATION':
        if (!subscriptionExist) {
          throw new ExceptionWithCode('User dont have any active subscription', 400)
        }

        await subscriptionExist.delete()

        console.log('Received cancellation event:', event)
        break
      case 'BILLING_ISSUE':
      case 'EXPIRATION':
        if (!subscriptionExist) {
          throw new ExceptionWithCode('User dont have any active subscription', 400)
        }

        await subscriptionExist
          .merge({
            subscriptionPaymentFailed: true,
          })
          .save()
        console.log('Received cancellation event:', event)
        break
      default:
        console.log('Unknown event type:', eventType)
    }

    return this.apiResponse('User Subscription Web hook Triggered Successfully', {received: true})
  }
}
