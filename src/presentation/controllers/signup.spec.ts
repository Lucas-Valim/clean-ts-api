import { SingUpController } from './sigup'
import { MissingParamError } from '../errors/missing-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { type EmailValidator } from '../protocols/email-validator'

interface SutTypes {
  emailValidatorStub: EmailValidator
  sut: SingUpController
}
const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SingUpController(emailValidatorStub)
  return {
    emailValidatorStub,
    sut
  }
}
describe('SingUpController', () => {
  test('Should return 400 if no name is provided ', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        emai: 'any_email@mail.com',
        password: 'any_password',
        password_confirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided ', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        password_confirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided ', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        emai: 'any_email@mail.com',
        password_confirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password confirmation is provided ', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password_confirmation'))
  })

  test('Should return 400 if an invalid email is provided ', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        password_confirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email ', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidaSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        password_confirmation: 'any_password'
      }
    }

    sut.handle(httpRequest)

    expect(isValidaSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })
})
