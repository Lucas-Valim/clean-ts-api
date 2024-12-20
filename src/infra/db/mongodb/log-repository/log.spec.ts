import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helpers';
import { LogMongoRepository } from './log';

type SutType = {
  sut: LogMongoRepository;
};

const makeSut = (): SutType => {
  const sut = new LogMongoRepository();
  return { sut };
};
describe('Log Mongo Respoitory', () => {
  let errorCollection: Collection;
  beforeAll(async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await MongoHelper.connect(process.env.MONGO_URL!);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors');
    await errorCollection.deleteMany({});
  });

  test('Should create an error log on success', async () => {
    const { sut } = makeSut();
    await sut.logError('any_error');

    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
  });
});
