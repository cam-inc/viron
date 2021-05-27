import mongoose, { Connection } from 'mongoose';
import {
  adminUsers,
  auditLogs,
  createModel,
} from '../../src/stores/definitions/mongo';

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
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  createModel(conn, adminUsers.name, adminUsers.schema);
  createModel(conn, auditLogs.name, auditLogs.schema);
  return conn;
}

afterAll(async () => {
  await mongoose.disconnect();
});
