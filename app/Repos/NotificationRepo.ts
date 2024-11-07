import BaseRepo from 'App/Repos/BaseRepo'
import Notification from 'App/Models/Notification'
import Helper from '../../app/Helpers/index'
import constants from "Config/constants";

class NotificationRepo extends BaseRepo {
  model

  constructor() {
    const relations = []
    const scopes = ['authFilter']
    super(Notification, relations, scopes)
    this.model = Notification
  }

  async sendPushNotificationToUser(
    userId,
    title,
    body,
    refId,
    refType,
    extra: any = null,
    storeNotification = true
  ) {


    /*
     * Save Notifications
     * */

    const payload: any = {
      notifiableId: userId,
      refId: refId,
      type: refType,
      title: title || constants.APP_NAME,
      message: body,
      extra: extra ? JSON.stringify(extra) : null,
    }

    if (storeNotification) {
      /*Save Notification*/
      const notification = await Notification.create(payload)
      payload.notification_id = notification.id
    }

    /*Send Notification*/
    await Helper.sendNotification(payload.title, body, payload, userId)

  }


}

export default new NotificationRepo()
