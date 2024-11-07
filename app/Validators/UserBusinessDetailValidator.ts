import {schema, rules} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";

export default class UserBusinessDetailValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }
    public schema = schema.create({
		business_name: schema.string({trim:true},[rules.maxLength(80),]),
		business_address: schema.string({trim:true},[rules.maxLength(255),]),
		bank_account_number: schema.string({trim:true},[rules.maxLength(20),]),
		bank_routing_number: schema.string({trim:true},[rules.maxLength(20),]),
		tax_id_number: schema.string({trim:true},[rules.maxLength(20),]),
		user_id: schema.number([]),

    })
}
