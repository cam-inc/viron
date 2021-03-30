import { noSetEnvMode } from '../errors';
import { ctx } from '../context';
import * as mongoRepositories from './mongo';
import * as mysqlRepositories from './mysql';
import { User, UserCreationAttributes } from '../domains/user';
import { MODE_MONGO, MODE_MYSQL } from '../constant';

interface Repository<D, C> {
  findById: (id: string) => Promise<D | null>;
  create: (obj: C) => Promise<D>;
}

type Names = keyof typeof mongoRepositories & keyof typeof mysqlRepositories;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getRepository = (name: Names): any => {
  switch (ctx.mode) {
    case MODE_MONGO:
      return mongoRepositories[name];
    case MODE_MYSQL:
      return mysqlRepositories[name];
    default:
      throw noSetEnvMode();
  }
};

export const getUserRepository = (): Repository<User, UserCreationAttributes> =>
  getRepository('users');
