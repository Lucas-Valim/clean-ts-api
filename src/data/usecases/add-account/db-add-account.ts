import { type AddAccount, type AddAccountModel, type AccountModel, type Encrypter } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encpryt(account.password)

    const accountToBeCreatedData = {
      id: 'id',
      name: 'name',
      email: 'email',
      password: 'password'
    }

    return await new Promise(resolve => { resolve(accountToBeCreatedData) })
  }
}
