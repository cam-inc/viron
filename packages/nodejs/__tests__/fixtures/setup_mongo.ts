import mongoose, { Connection } from 'mongoose';
import { getModels } from '../../src/infrastructures/mongo/models';

export async function setupMongo(): Promise<Connection> {
  //mongoose.set('debug', true);
  const openUri = process.env.MONGOD_URI;
  if (!openUri) {
    console.error('MONGOD_URI is not set.');
    process.exit(1);
  }

  const conn = mongoose.createConnection();
  await conn.openUri(openUri, {
    dbName: 'viron_test',
    autoIndex: true,
  });
  getModels(conn);
  return conn;
}

afterAll(async () => {
  await mongoose.disconnect();
});
