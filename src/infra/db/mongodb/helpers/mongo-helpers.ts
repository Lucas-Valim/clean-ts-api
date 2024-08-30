import { type Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  client: null as unknown as MongoClient,
  uri: null as unknown as string,

  async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri);
    this.uri = uri;
  },

  async disconnect(): Promise<void> {
    await this.client?.close();
    this.client = null;
  },
  async getCollection(name: string): Promise<Collection> {
    await this.connect(this.uri);
    return this.client.db().collection(name);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  map(collection: any): any {
    const { _id, ...collectionWithoutId } = collection;
    return Object.assign({}, collectionWithoutId, { id: _id });
  },
};
