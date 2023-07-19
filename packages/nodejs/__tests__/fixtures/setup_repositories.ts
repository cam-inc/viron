import MongooseAdapter from 'casbin-mongoose-adapter';
import { SequelizeAdapter } from 'casbin-sequelize-adapter';
import { STORE_TYPE } from '../../src/constants';
import {
  RepositoryContainer,
  repositoryContainer,
} from '../../src/repositories';
import { setupMongo } from './setup_mongo';

let container: RepositoryContainer;
export let mongooseAdapter: MongooseAdapter;
export let sequelizeAdapter: SequelizeAdapter;

beforeAll(async () => {
  const conn = await setupMongo();
  container = await repositoryContainer.init(STORE_TYPE.MONGO, conn);
  const adapter = container.getCasbin().getAdapter();
  if (adapter instanceof MongooseAdapter) {
    mongooseAdapter = adapter;
  } else if (adapter instanceof SequelizeAdapter) {
    sequelizeAdapter = adapter;
  }
}, 10000);

afterAll(async () => {
  if (container) {
    if (mongooseAdapter) {
      await mongooseAdapter.close();
    } else if (sequelizeAdapter) {
      await sequelizeAdapter.close();
    }

    await container.conn.close();
  }
});
