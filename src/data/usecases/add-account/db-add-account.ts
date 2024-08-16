import { type AddAccount, type AddAccountModel, type AccountModel, type Encrypter, type AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepositor: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepositor: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepositor = addAccountRepositor
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encpryt(accountData.password)
    const accountToBeCreatedData = Object.assign({}, accountData, { password: hashedPassword })

    const accountToBeCreatedData2 = {
      id: 'id',
      name: 'name',
      email: 'email',
      password: 'password'
    }

    await this.addAccountRepositor.add(accountToBeCreatedData)

    return await new Promise(resolve => { resolve(accountToBeCreatedData2) })
  }
}
