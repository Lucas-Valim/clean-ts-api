import {
  type AddAccountModel,
  type AccountModel,
} from '../usecases/add-account/db-add-account-protocols';

export interface AddAccountRepository {
  add: (account: AddAccountModel) => Promise<AccountModel>;
}
