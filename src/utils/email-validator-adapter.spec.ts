import { type EmailValidator } from '../presentation/protocols/email-validator';
import { EmailValidatorAdapter } from './email-validator-adapter';
import validator from 'validator';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  },
}));

const makeSut = (): EmailValidator => {
  const sut = new EmailValidatorAdapter();
  return sut;
};

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = makeSut();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isValid = sut.isValid('invalid_email@email.com');

    expect(isValid).toBe(false);
  });

  test('Should return true if validator returns true', () => {
    const sut = makeSut();
    const isValid = sut.isValid('valid_email@email.com');

    expect(isValid).toBe(true);
  });

  test('Should call EmailValidator with correct email ', () => {
    const sut = makeSut();
    const isValidSpy = jest.spyOn(validator, 'isEmail');
    sut.isValid('valid_email@email.com');

    expect(isValidSpy).toHaveBeenCalledWith('valid_email@email.com');
  });
});
