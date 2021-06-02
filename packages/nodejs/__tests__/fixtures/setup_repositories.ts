import { STORE_TYPE } from '../../src/constants';
import { repositoryContainer } from '../../src/repositories';
import { setupMongo } from './setup_mongo';

beforeAll(async () => {
  const conn = await setupMongo();
  await repositoryContainer.init(STORE_TYPE.MONGO, conn);
}, 10000);
