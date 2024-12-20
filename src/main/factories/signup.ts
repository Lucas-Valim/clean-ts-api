import { Controller } from '../../presentation/protocols';
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';
import { SingUpController } from '../../presentation/controllers/signup';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
import { LogControllerDecorator } from '../decorators/log';
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log';

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const emailValidator = new EmailValidatorAdapter();
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const logErrorRepository = new LogMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  const signupController = new SingUpController(emailValidator, dbAddAccount);
  return new LogControllerDecorator(signupController, logErrorRepository);
};
