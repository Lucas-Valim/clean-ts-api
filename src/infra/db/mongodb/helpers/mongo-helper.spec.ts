import { MongoHelper as sut } from './mongo-helpers';

describe('Mongo Helper', () => {
  beforeAll(async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await sut.connect(process.env.MONGO_URL!);
  });

  afterAll(async () => {
    await sut.disconnect();
  });

  test('Should recconnect if mongdb is down', async () => {
    let accountCollection = await sut.getCollection('accounts');
    expect(accountCollection).toBeTruthy();
    await sut.disconnect();
    accountCollection = await sut.getCollection('accounts');
    expect(accountCollection).toBeTruthy();
  });
});
