import Route from '@ioc:Adonis/Core/Route'
import Role from 'App/Models/Role'
import Module from 'App/Models/Module'

/****************************
 * Route Prefixed with api/v1
 *****************************/

Route.group(() => {
  /****************************
   * UnAuthenticated Routes
   *****************************/
  /*Login*/
  Route.post('login', 'Api/UserController.login')
  /*Forgot Password*/
  Route.post('forgot-password', 'Api/UserController.forgotPassword')
  /*Resend OTP*/
  Route.post('resend-otp', 'Api/UserController.resendOTP')
  /*Verify OTP*/
  Route.post('verify-otp', 'Api/UserController.verifyOTP')
  /*Reset Password*/
  Route.post('reset-password', 'Api/UserController.resetPassword')
  /*Create User or Register user*/
  Route.post('register', 'Api/UserController.registerUser')

  /*Unique validation*/

  Route.post('social-login', 'Api/UserController.socialLogin')


  /****************************
   * Authenticated Routes
   *****************************/

  Route.group(()=>{
    /*
    * Routes only accessible to Super admin, Restaurant admin and Establishment Users
    * */
    Route.group(()=>{

      /*
      * All User related Apis
      * */
      Route.group(()=>{
        /*Users*/
        Route.resource('users', 'Api/UserController').except(['store'])

      }).middleware(`permissions:${Module.ITEMS.USER_MANAGEMENT}`)

      /*Change Password*/
      Route.post('change-password', 'Api/UserController.changePassword')
      /*API-Notification*/
      Route.resource('notifications', 'Api/NotificationController').only(['index', 'show'])
      /* mark read */
      Route.post('mark-read/:id', 'Api/NotificationController.markRead')
      /* mark all read */
      Route.post('mark-all-read', 'Api/NotificationController.markAllRead')
      /* unread count */
      Route.get('get-unread-count', 'Api/NotificationController.unreadCount')
      /*Get All Restaurant users except admin and mobile users*/
      Route.get('get-restaurant-users','Api/UserController.getRestaurantUsers')


      /*Logout*/
      Route.post('/logout', 'Api/UserController.logout')

      /*
      * All Roles related Apis
      * */
      Route.group(()=>{
        /*API-Role*/
        Route.resource('roles','Api/RoleController')

      }).middleware(`permissions:${Module.ITEMS.ROLE_MANAGEMENT}`)


      Route.group(()=>{
        /*API-Transaction*/
        Route.resource('transactions','Api/TransactionController')
      }).middleware([`permissions:${Module.ITEMS.TRANSACTION_MANAGEMENT}`])

      Route.group(()=>{
        /*API-Plan*/
        Route.resource('plans','Api/PlanController')
      }).middleware([`permissions:${Module.ITEMS.PLAN_MANAGEMENT}`])

      Route.group(()=>{
        /*API-Breed*/
        Route.resource('breeds','Api/BreedController')
      }).middleware([`permissions:${Module.ITEMS.BREED_MANAGEMENT}`])

      Route.group(()=>{
        /*API-Pet*/
        Route.resource('pets','Api/PetController')
      }).middleware([`permissions:${Module.ITEMS.PET_MANAGEMENT}`])


      Route.group(()=>{
        /*API-Slot*/
        Route.resource('slots','Api/SlotController')
      }).middleware([`permissions:${Module.ITEMS.SLOT_MANAGEMENT}`])

      Route.group(()=>{
        /*API-Schedule*/
        Route.resource('schedules','Api/ScheduleController')
        /*API-ScheduleSlot*/
        Route.resource('schedule-slots','Api/ScheduleSlotController')

        Route.get('get-schedule-by-date','Api/ScheduleController.getScheduleByDate')

        /*API-ScheduleSlotTime*/
        Route.resource('schedule-slot-times','Api/ScheduleSlotTimeController')
      }).middleware([`permissions:${Module.ITEMS.SCHEDULE_MANAGEMENT}`])

      Route.group(()=>{
        /*API-Appointment*/
        Route.resource('appointments','Api/AppointmentController')

        Route.patch('update-appointment-status/:id', 'Api/AppointmentController.updateStatus')
      }).middleware([`permissions:${Module.ITEMS.APPOINTMENT_MANAGEMENT}`])


      Route.group(()=>{
        /*API-Card*/
        Route.resource('cards','Api/CardController')
      }).middleware([`permissions:${Module.ITEMS.CARD_MANAGEMENT}`])

      /*API-contact*/
      Route.resource('contact-us', 'Api/ContactController')
    }).middleware(`roles:${Role.TYPES.ADMIN},${Role.TYPES.PET},${Role.TYPES.VET}`)

    Route.group(()=>{
      /*API-UserDetail*/
      Route.resource('user-details','Api/UserDetailController')

      Route.post('payout-alter','Api/AppointmentController.sendPayoutAppointmentAlert')

      Route.post('platform-checkout','Api/UserController.vetPlatformCheckout')

      Route.get('appointment-stats','Api/AppointmentController.appointmentStats')
    }).middleware(`roles:${Role.TYPES.VET}`)

    Route.group(()=>{
      /*API-UserPet*/
      Route.resource('user-pets','Api/UserPetController')

      Route.post('add-user-pets','Api/UserPetController.addUserPets')

      /*API-Upload Health Records*/
      Route.post('upload-health-records','Api/UserController.uploadPetHealthRecords')

      Route.get('get-vets', 'Api/UserController.getVets')

      Route.get('vet-detail/:id', 'Api/UserController.show')


      Route.group(()=>{
        /*API-UserAddress*/
        Route.resource('user-addresses','Api/UserAddressController')
        /*API-UserAddress*/
        Route.patch('change-address-default/:id','Api/UserAddressController.changeAddressDefault')
      }).middleware([`permissions:${Module.ITEMS.USER_ADDRESSES}`])


    }).middleware(`roles:${Role.TYPES.PET}`)


    Route.group(()=>{
      Route.get('get-users-for-admin', 'Api/UserController.getUsersForAdmin')

      Route.post('add-page', 'Api/PageController.store')

      Route.post('payout-appointment', 'Api/AppointmentController.payoutAppointment')

      Route.post('approve-vet', 'Api/UserController.approveVet')

      Route.get('dashboard', 'Api/UserController.dashboardData')

      Route.get('get-monthly-appointment', 'Api/AppointmentController.getMonthlyAppointments')

      Route.post(
        'send-message-notification',
        'Api/NotificationController.sendMessagePushNotificationToUsers'
      )

      /*API-Setting*/
      Route.resource('settings','Api/SettingController').except(['store'])

      Route.post('change-user-status/:id','Api/UserController.changeUserStatus')
      Route.post('add-user', 'Api/UserController.registerByAdmin')

    }).middleware(`roles:${Role.TYPES.ADMIN}`)

    Route.get('get-setting','Api/SettingController.getSetting')


    /*API-Module*/
    Route.resource('modules','Api/ModuleController')


    Route.get('test-notification', 'Api/NotificationController.test')

    Route.post('update-profile', 'Api/UserController.updateProfile')

    Route.post('notification-toggle', 'Api/UserController.notificationToggle')

    Route.post('emergency-toggle', 'Api/UserController.emergencyToggle')

    /*API-SavedSearch*/
    Route.resource('saved-searches','Api/SavedSearchController')

    Route.post('create-meeting','Api/AppointmentController.createMeeting')

    Route.post('generate-jwt','Api/AppointmentController.generateJwt')


    Route.post('connect-paypal', 'Api/UserController.updatePaypalEmail')

    Route.post('remove-paypal', 'Api/UserController.removePaypal')
    /*API-Reason*/
    Route.resource('reasons','Api/ReasonController')


    Route.post('/delete-user-account', 'Api/UserController.deleteUserAccount')


    /*API-Report*/
    Route.resource('reports','Api/ReportController')
  }).middleware('auth')

  /*API-Page*/
  Route.resource('pages', 'Api/PageController').only(['index', 'show','destroy'])
  Route.get('page-by-slug/:slug', 'Api/PageController.pageBySlug')

  Route.post('/webhooks/revenue-cat', 'Api/UserSubscriptionController.revenueCatWebhook')
  Route.post('/webhooks/zoom','Api/AppointmentController.zoomWebhook')
  Route.post('/webhooks/paypal-payout','Api/AppointmentController.payoutWebHook')
}).prefix('/api/v1')
Route.get('return-connect-account', 'Api/UserController.connectAccountSuccess')
Route.get('return-connect-account-failure', 'Api/UserController.connectAccountFailure')
Route.get('connect-paypal', ({view}) => {
  return view.render('paypal')
})




/*API-Day*/
Route.resource('days','Api/DayController')


/*API-VetSpecialization*/
Route.resource('vet-specializations','Api/VetSpecializationController')


/*API-Contact*/
Route.resource('contacts','Api/ContactController')



/*API-UserSubscription*/
Route.resource('user-subscriptions','Api/UserSubscriptionController')

/*API-GatewayTransaction*/
Route.resource('gateway-transactions','Api/GatewayTransactionController')
