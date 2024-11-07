import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import {Exception} from "@adonisjs/core/build/standalone";

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new ExceptionWithCodeException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class InvalidRoleAccess extends Exception {

    message
    status

    constructor(message="Permission denied", status=403) {
        super(message, status);
        this.message = message
        this.status = status
    }

    public async handle(ctx: HttpContextContract){
        ctx.response.status(this.status).json({
            status: false, 
            message: this.message,
            data: null
        })
    }
}
