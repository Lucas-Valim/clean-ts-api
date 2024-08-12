import { MissingParamError } from '../errors/missing-param-error'
import { type HttpRequest, type HttpResponse } from '../protocols/http'
import { badRequest } from '../helpers/http-helper'
import { type Controller } from '../protocols/controller'
import { type EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../errors/invalid-param-error'
import { ServerError } from '../errors/server-error'

export class SingUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'password_confirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      let email: string = ''
      email = httpRequest.body.email
      const isEmailValid = this.emailValidator.isValid(email)
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }
      return {
        statusCode: 200,
        body: {}
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: new ServerError('error')
      }
    }
  }
}
