import { MongoMemoryServer } from 'mongodb-memory-server';
import { ctx } from '../../src/context';
import { MongoConfig } from '../../src/config';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer;

export async function setupMongo(): Promise<void> {
  // 接続先をmemory-serverに向ける
  mongod = new MongoMemoryServer();
  const config = ctx.config.store.main as MongoConfig;
  config.openUri = await mongod.getUri();
  // 認証不要のため消す
  delete config.connectOptions.user;
  delete config.connectOptions.pass;
}

afterAll(() => {
  mongoose.disconnect();
  if (mongod) {
    mongod.stop();
  }
});
