import { SingUpController } from './signup';
import { InvalidParamError, MissingParamError, ServerError } from '../errors';
import {
  type AddAccount,
  type AddAccountModel,
  type EmailValidator,
  type AccountModel,
  HttpRequest,
} from './signup/signup-protocols';
import { badRequest, ok, serverError } from '../helpers/http-helper';

interface SutTypes {
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
  sut: SingUpController;
}

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeAddAccountStub = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return await new Promise((resolve) => {
        resolve(makeFakeAccount());
      });
    }
  }
  return new AddAccountStub();
};

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
});

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub();
  const addAccountStub = makeAddAccountStub();
  const sut = new SingUpController(emailValidatorStub, addAccountStub);
  return {
    emailValidatorStub,
    addAccountStub,
    sut,
  };
};

describe('SingUpController', () => {
  test('Should return 400 if no name is provided ', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        emai: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')));
  });

  test('Should return 400 if no email is provided ', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Should return 400 if no password is provided ', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  test('Should return 400 if no password confirmation is provided ', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('passwordConfirmation')),
    );
  });

  test('Should return 400 if an invalid email is provided ', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  test('Should return 400 if an invalid password confirmation is provided ', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError('passwordConfirmation')),
    );
  });

  test('Should call EmailValidator with correct email ', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidaSpy = jest.spyOn(emailValidatorStub, 'isValid');

    await sut.handle(makeFakeRequest());
    expect(isValidaSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const response = await sut.handle(makeFakeRequest());
    expect(response).toEqual(serverError(new ServerError('error')));
  });

  test('Should call AddAccount with correct data ', async () => {
    const { sut, addAccountStub } = makeSut();
    const isValidaSpy = jest.spyOn(addAccountStub, 'add');

    await sut.handle(makeFakeRequest());

    expect(isValidaSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });
  });

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => {
        reject(new Error());
      });
    });

    const response = await sut.handle(makeFakeRequest());
    expect(response).toEqual(serverError(new ServerError('error')));
  });

  test('Should return 200 if valid data is provided ', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });
});
