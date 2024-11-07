import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'

export default class ResetPasswordValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }

    public schema = schema.create({
        password: schema.string({}, [
            rules.minLength(6),
            rules.confirmed(),
        ]),
        current_password: schema.string({}, [
            rules.minLength(6),
        ])
    })
}