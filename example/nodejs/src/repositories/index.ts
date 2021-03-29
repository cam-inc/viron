import { noSetEnvMode } from '../errors';
import { ctx } from '../context';
import { modeMysql, modeMongo } from '../constant';
import * as mongoRepositories from './mongo';
import * as mysqlRepositories from './mysql';
import { User, UserCreationAttributes } from '../domains/models/user';
import { domains } from '@viron/lib';

interface Repository<D, C> {
  findById: (id: string) => Promise<D | null>;
  create: (obj: C) => Promise<D>;
}

type Names = keyof typeof mongoRepositories & keyof typeof mysqlRepositories;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getRepository = (name: Names): any => {
  switch (ctx.mode) {
    case modeMongo:
      return mongoRepositories[name];
    case modeMysql:
      return mysqlRepositories[name];
    default:
      throw noSetEnvMode();
  }
};

export const getUserRepository = (): Repository<User, UserCreationAttributes> =>
  getRepository('users');

export const getAuditLogRepository = (): Repository<
  domains.models.auditLog.AuditLog,
  domains.models.auditLog.AuditLogCreationAttributes
> => getRepository('auditLogs');
