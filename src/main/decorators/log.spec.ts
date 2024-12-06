import { LogControllerDecorator } from './log';
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols';
import { serverError, ok } from '../../presentation/helpers/http-helper';
import { LogErrorRepository } from '@/data/protocols/log-error-repository';
import { AccountModel } from '@/domain/models/account';

interface SutTypes {
  sut: LogControllerDecorator;
  controlerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
}

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

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = 'any_satck';

  return serverError(fakeError);
};

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return await new Promise((resolve) => resolve(ok(makeFakeAccount())));
    }
  }
  return new ControllerStub();
};

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log(stack: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new LogErrorRepositoryStub();
};

const makeSut = (): SutTypes => {
  const controlerStub = makeControllerStub();
  const logErrorRepositoryStub = makeLogErrorRepository();
  const sut = new LogControllerDecorator(controlerStub, logErrorRepositoryStub);
  return { controlerStub, sut, logErrorRepositoryStub };
};

describe('LogController Decorator', () => {
  test('Ensure decorator calls controler handle', async () => {
    const { controlerStub, sut } = makeSut();

    const handleSpy = jest.spyOn(controlerStub, 'handle');

    await sut.handle(makeFakeRequest());
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
  });

  test('Should return same result of controller', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controlerStub, logErrorRepositoryStub } = makeSut();
    jest
      .spyOn(controlerStub, 'handle')
      .mockReturnValueOnce(
        new Promise((resolve) => resolve(makeFakeServerError())),
      );
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log');

    await sut.handle(makeFakeRequest());
    expect(logSpy).toHaveBeenCalledWith('any_satck');
  });
});
