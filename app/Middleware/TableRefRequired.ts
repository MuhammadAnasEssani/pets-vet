import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import UnauthorizedAccess from 'App/Exceptions/UnauthorizedAccess'
import ExceptionWithCode from 'App/Exceptions/ExceptionWithCode'

export default class TableRefRequired {
  public async handle({auth,request}: HttpContextContract, next: () => Promise<void>) {
    const user = auth.use('api').user
    if(!user) throw new UnauthorizedAccess()
    // code for middleware goes here. ABOVE THE NEXT CALL
    /*const roles:any = await user.related('roles').query()
    const endUserExists = roles.find((role)=>role.id === Role.TYPES.PET)
    if(!endUserExists){
      const tableId = request.input('table_id',null)
      if(!tableId) throw new ExceptionWithCode("Table id is Required", 422)
    }*/
    const establishmentId = request.input('establishment_id',null)
    if(!establishmentId) throw new ExceptionWithCode("Establishment id is Required", 422)
    await next()
  }
}
