import {BaseTask} from 'adonis5-scheduler/build'
import moment from 'moment'
import Appointment from "App/Models/Appointment";
import NotificationRepo from "App/Repos/NotificationRepo";
import Notification from "App/Models/Notification";

export default class AppointmentScheduler extends BaseTask {
  public static get schedule() {
    // Define the schedule for your task
    return '* * * * *' // Runs the task every minute
  }
  /**
   * Set enable use .lock file for block run retry task
   * Lock file save to `build/tmpTaskLock`
   */
  public static get useLock() {
    return false
  }

  public async handle() {
    // this.logger.info('Handled')

    // Get the current date
    const currentDate = new Date()

    // Get the specificDate in the format 'YYYY-MM-DD'
    const specificDate = moment(currentDate).add(30, 'minute').format('YYYY-MM-DD')

    // Get the specificTime in the format 'YYYY-MM-DD'
    const specificTime = moment(currentDate).add(30, 'minute').format('HH:mm:ss')


    console.log("specificDate",specificDate,"specificTime",specificTime)
    const appointments = await Appointment.query().where('appointment_date',specificDate).where('start_time',specificTime).preload('vet').preload('user')

    console.log(appointments)
    for (let appointment of appointments) {

      NotificationRepo.sendPushNotificationToUser(
        appointment.userId,
        null,
        `Reminder: Your appointment with ${appointment.vet.fullName} is scheduled for ${specificTime} on ${specificDate}.`,
        appointment.id,
        Notification.NOTIFICATION_REF_TYPE.APPOINTMENT_REMINDER,
        { status: true }
      )

      NotificationRepo.sendPushNotificationToUser(
        appointment.vetId,
        null,
        `Your appointment with ${appointment.user.fullName} is scheduled for ${specificTime} on ${specificDate}.`,
        appointment.id,
        Notification.NOTIFICATION_REF_TYPE.APPOINTMENT_REMINDER,
        { status: true }
      )
    }
  }
}
