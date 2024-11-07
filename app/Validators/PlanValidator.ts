import {schema, rules} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";

export default class PlanValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }
    public schema = schema.create({
		amount: schema.number([]),
		currency: schema.string([rules.trim(),rules.maxLength(255),]),
		description: schema.string.optional([rules.trim(),rules.maxLength(255),]),
		interval: schema.string([rules.trim(),rules.maxLength(255),]),
		name: schema.string([rules.trim(),rules.maxLength(255),]),
		product_id: schema.string([rules.trim(),rules.maxLength(255),]),

    })
}
