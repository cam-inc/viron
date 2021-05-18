import { Enforcer, newEnforcer } from 'casbin';
import { Connection as MongooseConnection, FilterQuery } from 'mongoose';
import { Sequelize, Dialect } from 'sequelize';
import { WhereOptions } from 'sequelize/types';
import MongooseAdapter from 'casbin-mongoose-adapter';
import { SequelizeAdapter } from 'casbin-sequelize-adapter';
import {
  domainsAdminRole,
  domainsAdminUser,
  domainsAuditLog,
} from '../domains';
import { STORE_TYPE, StoreType } from '../constants';
import { repositoryUninitialized } from '../errors';
import { ListWithPager } from '../helpers';
import * as mongoRepositories from './mongo';
import * as mysqlRepositories from './mysql';

type Names = keyof typeof mongoRepositories & keyof typeof mysqlRepositories;

export interface Repository<Entity, CreateAttributes, UpdateAttributes> {
  findOneById: (id: string) => Promise<Entity | null>;
  find: (/* TODO: pagerとかconditionはあとで */) => Promise<Entity[]>;
  findWithPager: (/* TODO: pagerとかconditionはあとで */) => Promise<
    ListWithPager<Entity>
  >;
  findOne: (
    conditions?: FilterQuery<Entity> | WhereOptions<Entity>
  ) => Promise<Entity>;
  createOne: (obj: CreateAttributes) => Promise<Entity>;
  updateOneById: (id: string, obj: UpdateAttributes) => Promise<void>;
  removeOneById: (id: string) => Promise<void>;
  count: () => Promise<number>;
}

class RepositoryContainer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  repositories!: any;
  conn!: Sequelize | MongooseConnection;
  private initialized: boolean;
  private casbin!: Enforcer;

  constructor() {
    this.initialized = false;
  }

  async init(
    storeType: StoreType,
    conn: Sequelize | MongooseConnection
  ): Promise<RepositoryContainer> {
    if (this.initialized) {
      return this;
    }

    switch (storeType) {
      case STORE_TYPE.MONGO: {
        this.conn = conn as MongooseConnection;
        this.repositories = mongoRepositories;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { url, options } = (this.conn.getClient() as any).s;
        const mongooseConfig = this.conn.config;
        const casbinMongooseAdapter = await MongooseAdapter.newAdapter(url, {
          dbName: this.conn.name,
          autoIndex: mongooseConfig.autoIndex,
          user: options.user,
          pass: options.password,
          useNewUrlParser: options.useNewUrlParser,
          useCreateIndex: mongooseConfig.useCreateIndex,
          authSource: options.authSource,
          useFindAndModify: mongooseConfig.useFindAndModify,
          useUnifiedTopology: options.useUnifiedTopology,
        });
        this.casbin = await newEnforcer(
          domainsAdminRole.rbacModel,
          casbinMongooseAdapter
        );
        break;
      }
      case STORE_TYPE.MYSQL: {
        this.conn = conn as Sequelize;
        this.repositories = mysqlRepositories;

        const casbinSequelizeAdapter = await SequelizeAdapter.newAdapter({
          dialect: this.conn.getDialect() as Dialect,
          database: this.conn.config.database,
          username: this.conn.config.username,
          password: this.conn.config.password || undefined,
          host: this.conn.config.host,
          port: this.conn.config.port
            ? Number(this.conn.config.port)
            : undefined,
          ssl: this.conn.config.ssl,
          protocol: this.conn.config.protocol,
        });
        this.casbin = await newEnforcer(
          domainsAdminRole.rbacModel,
          casbinSequelizeAdapter
        );
        break;
      }
    }

    this.initialized = true;
    return this;
  }

  get<Entity, CreateAttributes, UpdateAttributes>(
    name: Names
  ): Repository<Entity, CreateAttributes, UpdateAttributes> {
    if (!this.initialized) {
      throw repositoryUninitialized();
    }
    return this.repositories[name];
  }

  getCasbin(): Enforcer {
    if (!this.initialized) {
      throw repositoryUninitialized();
    }
    return this.casbin;
  }

  getAuditLogRepository(): Repository<
    domainsAuditLog.AuditLog,
    domainsAuditLog.AuditLogCreateAttributes,
    domainsAuditLog.AuditLogUpdateAttributes
  > {
    return this.get('auditLogs');
  }

  getAdminUserRepository(): Repository<
    domainsAdminUser.AdminUser,
    domainsAdminUser.AdminUserCreateAttributes,
    domainsAdminUser.AdminUserUpdateAttributes
  > {
    return this.get('adminUsers');
  }
}

export const repositoryContainer = new RepositoryContainer();
