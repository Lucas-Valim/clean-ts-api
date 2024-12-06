import {
  type AddAccountRepository,
  type AccountModel,
  type AddAccountModel,
  type Encrypter,
} from './db-add-account-protocols';
import { DbAddAccount } from './db-add-account';
interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeEncrypterStub = (): Encrypter => {
  class EncripyterStub implements Encrypter {
    async encpryt(password: string): Promise<string> {
      return await new Promise((resolve) => {
        resolve('encryptedPassword');
      });
    }
  }

  const encrypterStub = new EncripyterStub();
  return encrypterStub;
};

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'email@email.com',
  password: 'encryptedPassword',
});

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'email@email.com',
  password: 'encryptedPassword',
});

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      return await new Promise((resolve) => {
        resolve(makeFakeAccount());
      });
    }
  }
  return new AddAccountRepositoryStub();
};

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub();
  const addAccountRepositoryStub = makeAddAccountRepositoryStub();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);
  return {
    encrypterStub,
    addAccountRepositoryStub,
    sut,
  };
};

describe('DBAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encrypterSpy = jest.spyOn(encrypterStub, 'encpryt');

    await sut.add(makeFakeAccountData());
    expect(encrypterSpy).toHaveBeenCalledWith(makeFakeAccountData().password);
  });

  test('Should throw when Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encpryt').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error());
      }),
    );

    const promise = sut.add(makeFakeAccountData());

    await expect(promise).rejects.toThrow();
  });

  test('Should call AddAccountRepository with correct data', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

    await sut.add(makeFakeAccountData());

    expect(addSpy).toHaveBeenCalledWith(makeFakeAccountData());
  });

  test('Should throw when AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error());
      }),
    );

    const promise = sut.add(makeFakeAccountData());

    await expect(promise).rejects.toThrow();
  });

  test('Should return an account on success', async () => {
    const { sut } = makeSut();

    const response = await sut.add(makeFakeAccountData());

    expect(response).toEqual(makeFakeAccount());
  });
});
