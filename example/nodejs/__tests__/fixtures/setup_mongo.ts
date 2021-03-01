import { MongoMemoryServer } from 'mongodb-memory-server';
import { ctx } from '../../src/context';
import { MongoConfigure } from '../../src/configure';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer;

export async function setupMongo(): Promise<void> {
  // 接続先をmemory-serverに向ける
  mongod = new MongoMemoryServer();
  const configure = ctx.configure.store.main as MongoConfigure;
  configure.openUri = await mongod.getUri();
  // 認証不要のため消す
  delete configure.connectOptions.user;
  delete configure.connectOptions.pass;
}

afterAll(() => {
  mongoose.disconnect();
  if (mongod) {
    mongod.stop();
  }
});
