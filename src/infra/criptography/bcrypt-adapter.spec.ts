import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'
import { type Encrypter } from '../../data/protocols/encrypter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => { resolve('hash') })
  }
}))

interface SutTypes {
  sut: Encrypter
  salt: number
}

const makeSut = (): SutTypes => {
  const salt = 12
  const sut = new BcryptAdapter(salt)
  return { sut, salt }
}
describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const { sut, salt } = makeSut()
    const bcryptSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encpryt('any_value')

    expect(bcryptSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () => {
    const { sut } = makeSut()
    const hash = await sut.encpryt('any_value')

    expect(hash).toEqual('hash')
  })

  test('Should throw when Bcrypt throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.encpryt('any_value')

    await expect(promise).rejects.toThrow()
  })
})
