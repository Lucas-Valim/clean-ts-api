import { SingUpController } from './sigup'

describe('SingUpController', () => {
  test('Should return 400 if no name is provided ', () => {
    const sut = new SingUpController()
    const httpRequest = {
      emai: 'any_email@mail.com',
      password: 'any_password',
      password_confirmation: 'any_password'
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
