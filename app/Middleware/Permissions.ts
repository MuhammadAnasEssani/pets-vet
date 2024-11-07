import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import UnauthorizedAccess from 'App/Exceptions/UnauthorizedAccess'
import InvalidRoleAccess from 'App/Exceptions/InvalidRoleAccess'

export default class Permissions {
  public async handle({auth, request}: HttpContextContract, next: () => Promise<void>, _modules) {
    const user = auth.use('api').user
    if(!user) throw new UnauthorizedAccess()

    /*Check if the user belongs to the same establishment of the user registering it or Restaurant Admin or Super Admin*/
    // await UserRepo.authorizedForEstablishmentLevelTask()

    /*
    * Check the permissions user has
    * Get the route method
    * */

    let hasPermission = false

    const method = request.method()
    // const userModel = await User.query().where({id: user.id}).preload('roles').first()
    const roles = await user.related('roles').query()

    for (const role of roles){
      for (const permission of role.permissions){
        if(_modules.includes(permission.id.toString())){
          /*Check CRUD*/
          switch (method) {
            case 'POST':
              hasPermission = permission.$extras.pivot_create === 1
              break
            case 'GET':
              hasPermission = permission.$extras.pivot_read === 1
              break
            case 'PUT':
            case 'PATCH':
              hasPermission = permission.$extras.pivot_update === 1
              break
            case 'DELETE':
              hasPermission = permission.$extras.pivot_delete === 1
              break
          }
        }
      }
    }

    if(!hasPermission){
      throw new InvalidRoleAccess()
    }

    await next()


  }

}
