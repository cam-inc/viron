import { MongoMemoryServer } from 'mongodb-memory-server';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      mongod: MongoMemoryServer;
    }
  }
}

export default async (): Promise<void> => {
  const mongod = new MongoMemoryServer();
  global.mongod = mongod;
  process.env.MONGOD_URI = await mongod.getUri();
};
