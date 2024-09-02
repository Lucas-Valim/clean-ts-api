import { LogControllerDecorator } from './log';
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols';

interface SutTypes {
  sut: LogControllerDecorator;
  controlerStub: Controller;
}

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'Lucas',
        },
      };

      return await new Promise((resolve) => resolve(httpResponse));
    }
  }
  return new ControllerStub();
};

const makeSut = (): SutTypes => {
  const controlerStub = makeControllerStub();
  const sut = new LogControllerDecorator(controlerStub);
  return { controlerStub, sut };
};

describe('LogController Decorator', () => {
  test('Ensure decorator calls controler handle', async () => {
    const { controlerStub, sut } = makeSut();

    const handleSpy = jest.spyOn(controlerStub, 'handle');
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });
});
