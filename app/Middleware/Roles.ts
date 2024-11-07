import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import InvalidRoleAccess from "App/Exceptions/InvalidRoleAccess";

export default class Roles {
  public async handle({auth}: HttpContextContract, next: () => Promise<void>, roles) {
    let user:any = auth.user
    let exists  =  await User.query().whereHas('roles', (rolesQuery) => {
      rolesQuery.whereIn('id' , roles)
    }).where('id', user.id).first()
    if(!exists){
      throw new InvalidRoleAccess()
    }
    await next()
  }
}
