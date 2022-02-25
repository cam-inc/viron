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
  const mongod = await MongoMemoryServer.create();
  global.mongod = mongod;
  process.env.MONGOD_URI = mongod.getUri();
};
