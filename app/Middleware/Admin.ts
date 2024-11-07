import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Role'
import User from 'App/Models/User'
import InvalidRoleAccess from "App/Exceptions/InvalidRoleAccess";
import UnauthorizedAccess from "App/Exceptions/UnauthorizedAccess";

export default class Admin {
  public async handle({auth}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    let user:any = auth.user
    if (!user) throw new UnauthorizedAccess()
    let exists  =  await User.query().whereHas('roles', (rolesQuery) => {
      rolesQuery.where('id' , Role.TYPES.ADMIN)
    }).where('id', user.id).first()

    if(!exists){
      throw new InvalidRoleAccess()
    }
    await next()

  }
}
