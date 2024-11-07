import {schema, rules} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";

export default class GatewayTransactionValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }
    public schema = schema.create({
		gateway_transaction_id: schema.string([rules.trim(),rules.maxLength(255),]),
		payment_method_id: schema.string.optional([rules.trim(),rules.maxLength(255),]),
		response_object: schema.string([rules.trim(),rules.maxLength(65535),]),
		transaction_id: schema.number([]),

    })
}
