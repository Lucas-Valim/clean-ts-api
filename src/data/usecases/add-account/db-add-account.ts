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
    const accountWithHashedPassword = Object.assign({}, accountData, { password: hashedPassword })
    const account = await this.addAccountRepositor.add(accountWithHashedPassword)
    return account
  }
}
