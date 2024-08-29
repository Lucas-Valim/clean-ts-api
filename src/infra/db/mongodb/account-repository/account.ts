import { type AddAccountRepository } from '../../../../data/protocols/add-account-repository';
import {
  type AccountModel,
  type AddAccountModel,
} from '../../../../presentation/controllers/signup/signup-protocols';
import { MongoHelper } from '../helpers/mongo-helpers';

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const accountCreated = await accountCollection
      .insertOne(accountData)
      .then(
        async (result) =>
          await accountCollection.findOne({ _id: result.insertedId }),
      );

    const acountWithoutId = MongoHelper.map(accountCreated);
    return acountWithoutId;
  }
}
