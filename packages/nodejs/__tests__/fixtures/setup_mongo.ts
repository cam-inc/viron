import mongoose, { Connection } from 'mongoose';
import {
  adminUsers,
  auditLogs,
  revokedTokens,
} from '../../src/infrastructures/mongo/models';

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
  conn.model(adminUsers.name, adminUsers.schema);
  conn.model(auditLogs.name, auditLogs.schema);
  conn.model(revokedTokens.name, revokedTokens.schema);
  return conn;
}

afterAll(async () => {
  await mongoose.disconnect();
});
