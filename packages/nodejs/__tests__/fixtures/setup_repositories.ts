import MongooseAdapter from 'casbin-mongoose-adapter';
import { SequelizeAdapter } from 'casbin-sequelize-adapter';
import { STORE_TYPE } from '../../src/constants';
import {
  RepositoryContainer,
  repositoryContainer,
} from '../../src/repositories';
import { setupMongo } from './setup_mongo';

let container: RepositoryContainer;

beforeAll(async () => {
  const conn = await setupMongo();
  container = await repositoryContainer.init(STORE_TYPE.MONGO, conn);
}, 10000);

afterAll(async () => {
  if (container) {
    const adapter = container.getCasbin().getAdapter();
    if (adapter instanceof MongooseAdapter) {
      await adapter.close();
    } else if (adapter instanceof SequelizeAdapter) {
      await adapter.close();
    }

    await container.conn.close();
  }
});
