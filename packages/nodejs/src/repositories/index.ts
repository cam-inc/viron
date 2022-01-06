import { Enforcer, newEnforcer } from 'casbin';
import {
  Connection as MongooseConnection,
  FilterQuery as MongoFilterQuery,
  QueryOptions as MongoQueryOptions,
  ConnectOptions as MongoConnectOptions,
} from 'mongoose';
import { Sequelize, Dialect, Options as MysqlConnectOptions } from 'sequelize';
import {
  FindOptions as MysqlFindOptions,
  WhereOptions as MysqlWhereOptions,
} from 'sequelize/types';
import MongooseAdapter from 'casbin-mongoose-adapter';
import {
  SequelizeAdapter,
  SequelizeAdapterOptions,
} from 'casbin-sequelize-adapter';
import {
  domainsAdminRole,
  domainsAdminUser,
  domainsAuditLog,
  domainsAuth,
} from '../domains';
import { STORE_TYPE, StoreType } from '../constants';
import {
  repositoryInitializationError,
  repositoryUninitialized,
} from '../errors';
import { ListWithPager } from '../helpers';
import * as mongoRepositories from './mongo';
import * as mysqlRepositories from './mysql';
import {
  createConnection as mongoCreateConnection,
  getModels as mongoGetModels,
} from '../infrastructures/mongo';
import {
  createConnection as mysqlCreateConnection,
  getModels as mysqlGetModels,
} from '../infrastructures/mysql';
import { getDebug } from '../logging';

const debug = getDebug('repositories');

type Names = keyof typeof mongoRepositories & keyof typeof mysqlRepositories;

export type FindConditions<Entity> =
  | MongoFilterQuery<Entity>
  | MysqlWhereOptions<Entity>;

export type FindOptions<Entity> = MongoQueryOptions | MysqlFindOptions<Entity>;

export interface MongoConfig {
  openUri: string;
  connectOptions: MongoConnectOptions;
}

export interface MysqlConfig {
  connectOptions: MysqlConnectOptions;
}

export interface Repository<Entity, CreateAttributes, UpdateAttributes> {
  findOneById: (id: string) => Promise<Entity | null>;
  find: (
    conditions?: FindConditions<Entity>,
    sort?: string[] | null,
    options?: FindOptions<Entity>
  ) => Promise<Entity[]>;
  findWithPager: (
    conditions?: FindConditions<Entity>,
    size?: number,
    page?: number,
    sort?: string[] | null
  ) => Promise<ListWithPager<Entity>>;
  findOne: (conditions?: FindConditions<Entity>) => Promise<Entity | null>;
  count: (conditions?: FindConditions<Entity>) => Promise<number>;
  createOne: (obj: CreateAttributes) => Promise<Entity>;
  updateOneById: (id: string, obj: UpdateAttributes) => Promise<void>;
  removeOneById: (id: string) => Promise<void>;
}

export class RepositoryContainer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  repositories!: any;
  conn!: Sequelize | MongooseConnection;
  casbinSyncedTime: number;
  private initialized: boolean;
  private casbin!: Enforcer;

  constructor() {
    this.initialized = false;
    this.casbinSyncedTime = Date.now();
  }

  async init(
    storeType: StoreType,
    conn?: Sequelize | MongooseConnection,
    config?: MongoConfig | MysqlConfig
  ): Promise<RepositoryContainer> {
    if (this.initialized) {
      return this;
    }

    if (!conn && !config) {
      throw repositoryInitializationError();
    }

    switch (storeType) {
      case STORE_TYPE.MONGO: {
        const mongoConfig = config as MongoConfig;
        this.conn = conn
          ? (conn as MongooseConnection)
          : await mongoCreateConnection(
              mongoConfig.openUri,
              mongoConfig.connectOptions
            );
        mongoGetModels(this.conn);
        this.repositories = mongoRepositories;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { url, options } = (this.conn.getClient() as any).s;
        const mongooseConfig = this.conn.config;
        const casbinMongooseAdapterOptions: MongoConnectOptions = {
          dbName: this.conn.name,
          autoIndex:
            mongooseConfig.autoIndex ?? mongoConfig?.connectOptions?.autoIndex,
          user: options.user ?? options.credentials?.username,
          pass: options.password ?? options.credentials?.password,
          useNewUrlParser: true,
          useCreateIndex: true,
          authSource: options.authSource ?? options.credentials?.source,
          useFindAndModify: false,
          useUnifiedTopology: true,
          ssl: options.ssl ?? mongoConfig?.connectOptions?.ssl,
          sslValidate:
            options.sslValidate ?? mongoConfig?.connectOptions?.sslValidate,
          sslCA: options.sslCA ?? mongoConfig?.connectOptions?.sslCA,
        };
        debug(
          'Init casbin-mongoose-adapter. url: %s, options: %O',
          url,
          casbinMongooseAdapterOptions
        );
        const casbinMongooseAdapter = await MongooseAdapter.newAdapter(
          url,
          casbinMongooseAdapterOptions
        );
        this.casbin = await newEnforcer(
          domainsAdminRole.rbacModel,
          casbinMongooseAdapter
        );
        break;
      }
      case STORE_TYPE.MYSQL: {
        const mysqlConfig = config as MysqlConfig;
        this.conn = conn
          ? (conn as Sequelize)
          : await mysqlCreateConnection(mysqlConfig.connectOptions);
        mysqlGetModels(this.conn);
        this.repositories = mysqlRepositories;

        const casbinSequelizeAdapterOptions: SequelizeAdapterOptions = {
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
        };
        debug(
          'Init casbin-sequelize-adapter. options: %O',
          casbinSequelizeAdapterOptions
        );
        const casbinSequelizeAdapter = await SequelizeAdapter.newAdapter(
          casbinSequelizeAdapterOptions
        );
        this.casbin = await newEnforcer(
          domainsAdminRole.rbacModel,
          casbinSequelizeAdapter
        );
        break;
      }
    }

    this.initialized = true;
    this.casbinSyncedTime = Date.now();
    //this.casbin.enableLog(true);
    debug('RepositoryContainer initialized!');
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

  getRevokedTokenRepository(): Repository<
    domainsAuth.RevokedToken,
    domainsAuth.RevokedTokenCreateAttributes,
    domainsAuth.RevokedTokenUpdateAttributes
  > {
    return this.get('revokedTokens');
  }
}

export const repositoryContainer = new RepositoryContainer();
