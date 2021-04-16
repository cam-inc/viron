import mongoose from 'mongoose';
import { Sequelize } from 'sequelize';
import { domainsAuditLog } from '../domains';
import { STORE_TYPE, StoreType } from '../constants';
import { repositoryUninitialized } from '../errors';
import * as mongoRepositories from './mongo';
import * as mysqlRepositories from './mysql';

type Names = keyof typeof mongoRepositories & keyof typeof mysqlRepositories;

export interface Repository<D, C> {
  findOneById: (id: string) => Promise<D | null>;
  find: (/* TODO: pagerとかconditionはあとで */) => Promise<D[]>;
  createOne: (obj: C) => Promise<D>;
}

class RepositoryContainer {
  storeType?: StoreType;
  conn?: Sequelize | mongoose.Connection;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  repositories?: any;
  initialized: boolean;

  constructor() {
    this.initialized = false;
  }

  init(
    storeType: StoreType,
    conn: Sequelize | mongoose.Connection
  ): RepositoryContainer {
    if (this.initialized) {
      return this;
    }

    this.storeType = storeType;
    switch (storeType) {
      case STORE_TYPE.MONGO:
        this.conn = conn as mongoose.Connection;
        this.repositories = mongoRepositories;
        break;
      case STORE_TYPE.MYSQL:
        this.conn = conn as Sequelize;
        this.repositories = mysqlRepositories;
        break;
    }
    this.initialized = true;
    return this;
  }

  get<D, C>(name: Names): Repository<D, C> {
    if (!this.initialized) {
      throw repositoryUninitialized();
    }
    return this.repositories[name];
  }

  getAuditLogRepository(): Repository<
    domainsAuditLog.AuditLog,
    domainsAuditLog.AuditLogCreationAttributes
  > {
    return this.get('auditLogs');
  }
}

export const repositoryContainer = new RepositoryContainer();
