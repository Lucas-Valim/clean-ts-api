import { DbAddAccount } from './db-add-account'

describe('DBAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    class EncripyterStub {
      async encpryt (password: string): Promise<string> {
        return await new Promise(resolve => { resolve('encryptedPassword') })
      }
    }
    const encrypterStub = new EncripyterStub()
    const encrypterSpy = jest.spyOn(encrypterStub, 'encpryt')
    const sut = new DbAddAccount(encrypterStub)

    const account = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }

    await sut.add(account)
    expect(encrypterSpy).toHaveBeenCalledWith(account.password)
  })
})
