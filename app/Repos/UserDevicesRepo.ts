// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseRepo from 'App/Repos/BaseRepo'

import {RequestContract} from "@ioc:Adonis/Core/Request";
import UserDevice from "App/Models/UserDevice";

class UserDevicesRepo extends BaseRepo {
  model

  constructor() {
    const relations = ['attachments']
    const scopes = []
    super(UserDevice, relations,scopes)
    this.model = UserDevice
  }

  // @ts-ignore
  async store(request: RequestContract, userId:number) {
    const input = request.only([ 'device_type', 'device_token', 'push_notification', 'platform'])
    return await this.model.updateOrCreate(
      {user_id: userId, device_type: input.device_type, device_token: input.device_token},
      input
    )
  }
}

/*Create a singleton instance*/
export default new UserDevicesRepo()
