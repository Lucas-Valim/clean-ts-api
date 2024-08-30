import { DbAddAccount } from '../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';
import { SingUpController } from '../../presentation/controllers/signup';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
// import { SingUpController } from '../../presentation/controllers/signup';

export const makeSignUpController = (): SingUpController => {
  const salt = 12;
  const emailValidator = new EmailValidatorAdapter();
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  return new SingUpController(emailValidator, dbAddAccount);
};