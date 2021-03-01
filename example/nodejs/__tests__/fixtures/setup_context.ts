import { ctx } from '../../src/context';
import { setupMongo } from './setup_mongo';
import { setupMysql } from './setup_mysql';

beforeAll(async () => {
  await setupMongo();
  await setupMysql();

  await ctx.preflight();
});
