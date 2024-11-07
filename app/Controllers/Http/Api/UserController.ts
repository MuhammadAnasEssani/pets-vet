import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import UserRepo from 'App/Repos/UserRepo'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import UserValidator from 'App/Validators/UserValidator'
import constants from 'Config/constants'
import Mail from '@ioc:Adonis/Addons/Mail'
import ForgotPasswordValidator from 'App/Validators/ForgotPasswordValidator'
import ExceptionWithCode from 'App/Exceptions/ExceptionWithCode'
import VerifyOTPValidator from 'App/Validators/VerifyOTPValidator'
import ResetPasswordValidator from 'App/Validators/ResetPasswordValidator'
import Hash from '@ioc:Adonis/Core/Hash'
import ChangePasswordValidator from 'App/Validators/ChangePasswordValidator'
import UserDevicesRepo from 'App/Repos/UserDevicesRepo'
import UniqueValidation from 'App/Validators/UniqueValidation'
import LoginValidator from 'App/Validators/LoginValidator'
import InvalidRoleAccess from 'App/Exceptions/InvalidRoleAccess'
import SocialAccountRepo from 'App/Repos/SocialAccountRepo'
import SocialLoginValidator from 'App/Validators/SocialLoginValidator'
import Role from 'App/Models/Role'
import EditUserValidator from 'App/Validators/EditUserValidator'
import Attachment from 'App/Models/Attachment'
import {rules, schema, validator} from "@ioc:Adonis/Core/Validator";
import UpdateHealthRecordValidator from "App/Validators/UpdateHealthRecordValidator";
import NotificationToggleValidator from "App/Validators/NotificationToggleValidator";
import VetPlatformCheckoutValidator from "App/Validators/VetPlatformCheckoutValidator";
import axios from "axios";
import User from "App/Models/User";
import UpdatePaypalEmailValidator from "App/Validators/UpdatePaypalEmailValidator";
import ApproveVetValidator from "App/Validators/ApproveVetValidator";
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import EmergencyToggleValidator from "App/Validators/EmergencyToggleValidator";

export default class UserController extends ApiBaseController {

  constructor() {
    super(UserRepo);
  }

  async getUsersForAdmin(ctx: HttpContextContract) {
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
      roles: validatedParams?.roles || [
        Role.TYPES.PET,
        Role.TYPES.VET,
      ],
      start_date: validatedParams?.start_date || null,
      end_date: validatedParams?.end_date || null,
    }

    let pagination = validatedParams?.pagination
    let page = ctx.request.input('page', 1)
    let perPage = ctx.request.input('per-page', constants.PER_PAGE)
    let orderByColumn = ctx.request.input('order-column', constants.ORDER_BY_COLUMN)
    let orderByValue = ctx.request.input('order', constants.ORDER_BY_VALUE)

    let rows = await this.repo.getUsersForAdmin(
      data,
      orderByColumn,
      orderByValue,
      page,
      perPage,
      pagination
    )
    return this.apiResponse('Records fetched successfully', rows)
  }


  async dashboardData(_ctx: HttpContextContract) {


    let rows = await this.repo.dashboardData()
    return this.apiResponse('Records fetched successfully', rows)
  }

  async getVets(ctx: HttpContextContract) {
    const validatePagination = schema.create({
      pagination: schema.boolean.optional(),
    })
    const validatedParams = await ctx.request.validate({
      schema: validatePagination,
      reporter: validator.reporters.api,
    })
    let pagination = validatedParams?.pagination
    let page = ctx.request.input('page', 1)
    let perPage = ctx.request.input('per-page', constants.PER_PAGE)
    let orderByColumn = ctx.request.input('order-column', constants.ORDER_BY_COLUMN)
    let orderByValue = ctx.request.input('order', constants.ORDER_BY_VALUE)

    let rows = await this.repo.getVets(
      orderByColumn,
      orderByValue,
      page,
      perPage,
      pagination
    )
    return this.apiResponse('Records fetched successfully', rows)
  }

  async me(ctx: HttpContextContract) {
    const user: any = ctx.auth.user;
    let profile = await UserRepo.show(user.id)
    return super.apiResponse("Profile fetched successfully", {profile})
  }

  async notificationToggle(ctx: HttpContextContract) {
    await super.validateBody(ctx,NotificationToggleValidator)
    let profile = await UserRepo.notificationToggle(ctx)
    return super.apiResponse("Updated successfully", {profile})
  }

  async emergencyToggle(ctx: HttpContextContract) {
    await super.validateBody(ctx,EmergencyToggleValidator)
    let profile = await UserRepo.emergencyToggle(ctx)
    return super.apiResponse("Updated successfully", {profile})
  }


  async removePaypal(ctx: HttpContextContract) {
    let profile = await UserRepo.removePaypal(ctx)
    return super.apiResponse("Updated successfully", {profile})
  }

  async changeUserStatus(ctx: HttpContextContract) {
    let profile = await UserRepo.changeUserStatus(ctx)
    return super.apiResponse("Updated successfully", {profile})
  }

  async login(ctx: HttpContextContract) {
    await super.validateBody(ctx,LoginValidator)
    const password = ctx.request.input('password')
    let phone = ctx.request.input('phone', null)
    let email = ctx.request.input('email', null)
    let accessToken = await ctx.auth.attempt(email || phone, password, {
      expiresIn: constants.AUTH_TOKEN_EXPIRY
    })
    let user:any

    user = await this.repo.model.query().where('email', email).first()

    if (!user) throw new InvalidRoleAccess()

    await user.load('roles')

    const isVet = user!.roles.find((role) => role.id === Role.TYPES.VET)
    if(isVet) {
      if(user.isCompleted && !user.isApproved) throw new ExceptionWithCode("User is not approved",601)
    }

    user = await UserRepo.show(user.id)



    /*
    * Save Device Token
    * */
    await UserDevicesRepo.store(ctx.request, user.id)

    return super.apiResponse("Logged in successfully", {user, access_token: accessToken})
  }


  async logout(ctx: HttpContextContract) {
    const user = ctx.auth.use('api').user
    if(user){
      await ctx.auth.use('api').revoke()
      await UserDevicesRepo.model.query().where({user_id: user.id}).delete()
    }
    return super.apiResponse("Logged out successfully")
  }

  async register(input, ctx) {

    let data: any = {}
    let user = await UserRepo.model.updateOrCreate({
      email: input.email,
      is_verified: 0
    }, input)
    data.access_token = await ctx.auth.use('api').generate(user)

    /*
    * Save Device Token
    * */
    await UserDevicesRepo.store(ctx.request, user.id)

    const image = ctx.request.input('image_url', null)
    if (image) {
      const userImage: any = {
        path: image,
        instanceType: Attachment.TYPE.USER,
        mimeType: 'image',
      }
      await user.related('user_image').create(userImage)
    }

    /*
    * Send OTP
    * */
    await UserRepo.generateAndSendOTP(input.email, 'email');

    const roleId = ctx.request.input('role_id')


    /*
    * Attach user roles
    * */
    await user.related('roles').sync([roleId], false);


    /*Send Welcome Email*/
    if (user.email) {
      // await Mail.sendLater((message) => {
      //   message
      //     .from(constants.APP_NAME)
      //     .to(user.email)
      //     .subject('Welcome Onboard!')
      //     .htmlView('emails/welcome', {user: user.fullName, app_name: constants.APP_NAME})
      // })
      // await UserRepo.generateAndSendOTP(user.email, 'email');

    }

    data.user = await UserRepo.show(user.id)

    return super.apiResponse(`A new user has been created successfully`, data)
  }

  async registerUser(ctx: HttpContextContract) {
    await super.validateBody(ctx,UserValidator)
    let fillables: any = UserRepo.fillables(['verification_code','is_verified','is_completed','is_approved'])
    let input = ctx.request.only(fillables)
    return this.register(input, ctx)
  }


  async registerByAdmin(ctx: HttpContextContract) {

    await super.validateBody(ctx,CreateUserValidator)
    let fillables: any = UserRepo.fillables(['verification_code','is_verified','is_completed','is_approved'])
    let input = ctx.request.only(fillables)

    let data: any = {}
    let user = await UserRepo.model.create(input)
    // data.access_token = await ctx.auth.use('api').generate(user)

    /*
    * Save Device Token
    * */
    // await UserDevicesRepo.store(ctx.request, user.id)

    const image = ctx.request.input('image_url', null)
    if (image) {
      const userImage: any = {
        path: image,
        instanceType: Attachment.TYPE.USER,
        mimeType: 'image',
      }
      await user.related('user_image').create(userImage)
    }

    /*
    * Send OTP
    * */
    // await UserRepo.generateAndSendOTP(input.email, 'email');

    const roleId = ctx.request.input('role_id')


    /*
    * Attach user roles
    * */
    await user.related('roles').sync([roleId], false);


    /*Send Welcome Email*/
    if (user.email) {
      await Mail.sendLater((message) => {
        message
          .from(constants.APP_NAME)
          .to(user.email)
          .subject('Welcome Onboard!')
          .htmlView('emails/welcome-by-admin', {user: user, app_name: constants.APP_NAME,})
      })
    }

    data.user = await UserRepo.show(user.id)

    return super.apiResponse(`A new user has been created successfully`, data)
  }



  async forgotPassword({request}: HttpContextContract) {
    await request.validate(ForgotPasswordValidator)
    let user
    let email = request.input('email')
    let phone = request.input('phone')
    if (phone) {
      user = await UserRepo.model.query().where({
        phone
      }).firstOrFail()
    } else if (email) {
      user = await UserRepo.model.query().where({
        email
      }).firstOrFail()
    }
    // let user = await UserRepo.model.findByOrFail('email', request.input('email'));

    let verification_code = Math.floor(1000 + Math.random() * 9000);
    // let verification_code = "0000"

    if(phone) {
      /*
      * Send sms through twilio
      * */
    }
    else if (email) {
      await Mail.sendLater((message) => {
        message
          .from(constants.APP_NAME)
          .to(user.email)
          .subject('Forgot Password Verification Code')
          .htmlView('emails/verify', {
            name: user.full_name,
            app_name: constants.APP_NAME,
            verification_code
          })
      })
    }
    await UserRepo.updateVerificationCode(user, verification_code)
    return super.apiResponse("Verification Code Send To Your Email")
  }

  async resendOTP(ctx: HttpContextContract) {
    await super.validateBody(ctx,ForgotPasswordValidator)
    let phone = ctx.request.input('phone')
    let email = ctx.request.input('email')

    if (email) {
      await UserRepo.generateAndSendOTP(email, 'email');
    } else if (phone) {
      await UserRepo.generateAndSendOTP(phone, 'phone');
    }
    return this.apiResponse("Code has been sent successfully")
  }

  async verifyOTP({request}) {
    await request.validate(VerifyOTPValidator)
    let phone = request.input('phone')
    let email = request.input('email')
    let user
    if (phone) {
      user = await UserRepo.model.query().where({
        verification_code: request.input('otp_code'),
        phone
      }).first()
    } else if (email) {
      user = await UserRepo.model.query().where({
        verification_code: request.input('otp_code'),
        email
      }).first()
    }
    if (!user) {
      throw new ExceptionWithCode("Invalid OTP Code", 400)
    }

    user.merge({
      is_verified: 1
    })
    await user.save()

    user = await UserRepo.show(user.id)

    return super.apiResponse("Code Verified", {user: user})
  }

  async resetPassword({request}) {
    await request.validate(ResetPasswordValidator)
    let phone = request.input('phone')
    let email = request.input('email')
    let user
    if (phone) {
      user = await UserRepo.model.query().where({
        verification_code: request.input('otp_code'),
        phone
      }).first()
    } else if (email) {
      user = await UserRepo.model.query().where({
        verification_code: request.input('otp_code'),
        email
      }).first()
    }
    if (!user) {
      throw new ExceptionWithCode("Invalid OTP Code", 400)
    }

    user.password = request.input('password')
    user.verification_code = null
    await user.save()

    return super.apiResponse("Password Changed Successfully")
  }

  async changePassword({request, auth}) {
    await request.validate(ChangePasswordValidator)
    let user = await UserRepo.model.findOrFail(auth.user.id)
    let verify = await Hash.verify(user.password, request.input('current_password'))
    if (!verify) {
      throw new ExceptionWithCode("Wrong password", 400)
    }
    user.password = request.input('password')
    await user.save()
    return super.apiResponse("Password Changed Successfully")
  }

  async uniqueValidation(ctx) {
    await super.validateBody(ctx,UniqueValidation)
    // let otp_code:any = Math.round(Math.random() * (90000 - 10000) + 10000);
    let otp_code: any = '0000'
    let data = {
      verification_code: otp_code,
      email: ctx.request.input('email', null),
      phone: ctx.request.input('phone', null),
      is_completed: UserRepo.model.PROFILE_COMPLETE_STATUS.INCOMPLETE
    }
    await UserRepo.model.updateOrCreate({
      email: ctx.request.input('email', null),
      phone: ctx.request.input('phone', null),
      is_completed: UserRepo.model.PROFILE_COMPLETE_STATUS.INCOMPLETE
    }, data)

    if (ctx.request.input('email', null)) {
      await Mail.sendLater((message) => {
        message
          .from(constants.APP_NAME)
          .to(ctx.request.input('email', null))
          .subject('Verification Code!')
          .htmlView('emails/verification-code', {verification_code: otp_code})
      })
    }


    if (ctx.request.input('phone', null)) {
      /*
      * Send sms through twilio
      * */
    }

    return super.apiResponse("Verification code has been sent successfully!", {code: otp_code})
  }

  async socialLogin(ctx: HttpContextContract) {
    await super.validateBody(ctx,SocialLoginValidator)
    let fillables: any = UserRepo.fillables()
    let input = ctx.request.only(fillables)

    /*
    * Find User based on email
    * */
    let userExists = await this.repo.model.query().where({email:input.email, is_social_login: 0}).first()
    if(userExists) throw new ExceptionWithCode("You already have an account with your email. Continue with email instead.", 400)

    let socialAccount = await SocialAccountRepo.findSocialLogin(ctx.request)

    let user;
    if (socialAccount) {
      user = await UserRepo.model.query().where('id', socialAccount.user_id).first()
    }

    // let role_id = ctx.request.input('role_id')
    if (!user) {
      //let exists = await UserRepo.model.query().where({email: ctx.request.input('email')}).first()
      input.password = Math.random().toString(36).substring(2, 15)
      input.is_verified = 1;
      input.is_approved = 1;
      input.is_social_login = 1;
      user = await UserRepo.model.updateOrCreate({
        email: ctx.request.input('email', null)
      }, input)
      await user.related('roles').sync([Role.TYPES.PET])
      await SocialAccountRepo.store(ctx.request, user.id)

      if (input.image) {
        await UserRepo.model.query().where('id', user.id).update({image: input.image})
      }
    }


    await UserDevicesRepo.store(ctx.request, user.id)
    let token = await ctx.auth.use('api').generate(user)

    user = await UserRepo.show(user.id)

    return super.apiResponse(`Login Successfully`, {user, access_token: token})
  }

  async update(ctx: HttpContextContract, instanceType?: number): Promise<{ data: any; message: string; status: boolean }> {
    await super.validateBody(ctx,EditUserValidator)
    let input = ctx.request.only(this.repo.fillables(['establishment_id']))
    const res = await UserRepo.update(ctx.request.param('id'), input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()])
    return this.apiResponse('Record updated successfully!', res)
  }

  async uploadPetHealthRecords(ctx: HttpContextContract): Promise<{ data: any; message: string; status: boolean }> {
    await super.validateBody(ctx,UpdateHealthRecordValidator)
    const res = await UserRepo.uploadPetHealthRecords(ctx.request)
    return this.apiResponse('Record updated successfully!',res)
  }


  async updateProfile(
    ctx: HttpContextContract,
    instanceType?: number
  ): Promise<{data: any; message: string; status: boolean}> {
    await super.validateBody(ctx, EditUserValidator)
    let input = ctx.request.only(
      this.repo.fillables([
        'email',
        'password',
        'is_verified',
        'is_completed',
        'is_approved',
        'is_social_login',
        'verification_code',
        "emergency_location",
        "share_pet_record",
        "social_platform",
        "client_id",
        "token"
      ])
    )

    const res = await UserRepo.updateProfile(
      input,
      ctx.request,
      instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()]
    )
    return this.apiResponse('Record updated successfully!', res)
  }

  async connectAccountSuccess({request, view}) {
    console.log(request.input('id_token',null))
    /*let input = request.only(['user_id', 'account_id'])
    if (input.hasOwnProperty('user_id') && input.hasOwnProperty('account_id')) {
      let account = await stripeRepo.getAccountInfo(input.account_id)
      if (account.details_submitted) {
        await userRepo.model.query().where('id', input.user_id).update({connect_account_id: input.account_id})
      }
    }*/
    return view.render('payment-success',{id_token:request.input('id_token',null)})
  }

  async connectAccountFailure({ view}) {
    // let input = request.only(['user_id'])
    // if (input.hasOwnProperty('user_id')) {
    //   await userRepo.model.query().where('id', input.user_id).update({connect_account_id: null})
    // }
    return view.render('payment-failure')
  }

  async updatePaypalEmail(ctx: HttpContextContract,) {
    await super.validateBody(ctx, UpdatePaypalEmailValidator)

    const user = ctx.auth.use('api').user
    let url = "https://api-m.sandbox.paypal.com/v1/identity/oauth2/userinfo?schema=paypalv1.1"
    let res : any = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${ctx.request.input('id_token')}`
      }
    });
    res = res.data
    if (res?.emails[0]?.confirmed) {
      let email = res.emails[0].value
      await User.query().where('id',user!.id).update({
        connect_account_id: email
      })
      const updatedUser = await UserRepo.show(user!.id)
      return this.apiResponse('Paypal email updated successfully!', updatedUser)
    }else{
      throw new ExceptionWithCode("Dit not get email",400)
    }
  }

  async vetPlatformCheckout(ctx: HttpContextContract) {
    await super.validateBody(ctx,VetPlatformCheckoutValidator)

    let row = await this.repo.vetPlatformCheckout()
    return this.apiResponse('Successful', row)

  }

  async approveVet(ctx: HttpContextContract) {
    await super.validateBody(ctx,ApproveVetValidator)

    let row = await this.repo.approveVet(ctx)
    return this.apiResponse('Successful', row)

  }

  async deleteUserAccount() {
    await UserRepo.deleteUserAccount()
    return super.apiResponse('User Account Deleted successfully')
  }
}
