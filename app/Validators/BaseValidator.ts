import {validator} from '@ioc:Adonis/Core/Validator'

export default class BaseValidator {
  constructor() {
  }

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */

  public reporter = validator.reporters.api

  public messages = {
    // '*': (field, rule) => {
    //     return `Validation error on ${field}`
    // },

    '*': (field, _rule) => {
      return `${_rule} Validation error on ${field}`
    },
    array: "{{field}} should be an array",
    nullable: "The {{field}} should exist",
    required: "The {{field}} is required",
    unique: "The {{field}} has already been taken",
    email: "The email is not valid",
    minLength: "The {{field}} should have atleast one item",
    maxLength: "The {{field}} should not greater than {{options.minLength}} character",
    confirmed: "The {{field}} doesn't match",
    otp_code: "The {{field}} is required",
    mobile: "The {{field}} format is invalid",
    number: "The {{field}} should be a number",
    "phone.requiredIfNotExists": 'Phone is required',
    exists: "The {{field}} does not exist",
    boolean : "The data is invalid, only 1 or 0 is allowed",
    "date.format" : "Invalid date format",
    'role_id.enum': "Invalid value provided for {{field}} ",
    'device_type.enum' : "Invalid value provided for {{field}} - The value must be one of {{ options.choices }}",
    // 'permissions.*.create.boolean' : "The data is invalid, only 1 or 0 is allowed",
    // 'permissions.*.read.boolean' : "The data is invalid, only 1 or 0 is allowed",
    // 'permissions.*.update.boolean' : "The data is invalid, only 1 or 0 is allowed",
    // 'permissions.*.delete.boolean' : "The data is invalid, only 1 or 0 is allowed",

    'time_tables.*.end_time.required' : 'End time is required',
    'time_tables.*.end_time.format' : "The end time format should be  H:M:S",
    'time_tables.*.start_time.required' : 'Start time is required',
    'time_tables.*.start_time.format' : "The start time format should be  H:M:S",
    'time_tables.*.from_date.required' : 'From date is required',
    'time_tables.*.from_date.after' : "The 'from' date should be greater than today",
    'payment_method.requiredWhen' : "Payment method is required",
    "time_tables.minLength" : "Time schedule is required",
    "time_tables.required" : "Time schedule is required",
    "expiry_date.afterOrEqualToField" : "Expiry date should be greater than start date."
  }
}
