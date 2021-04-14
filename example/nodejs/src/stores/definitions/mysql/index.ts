import { Sequelize } from 'sequelize';
import * as users from './users';
import { stores } from '@viron/lib';

const { auditLogs } = stores.definitions.mysql;

/////////////////////////////
// Definition
/////////////////////////////

/**
 * Definitions by collection (interface)
 */
export interface MysqlDefinitions
  extends stores.definitions.mysql.MysqlDefinitions {
  users: {
    name: string;
    createModel: typeof users.createModel;
  };
}

/**
 * Definitions by collection (entity)
 */
export const definitions: MysqlDefinitions = {
  users: {
    name: users.name,
    createModel: users.createModel,
  },
  auditLogs: {
    name: auditLogs.name,
    createModel: auditLogs.createModel,
  },
};

// definition index signature key
export type MysqlDefinitionKeys = keyof MysqlDefinitions;

/////////////////////////////
// Model
/////////////////////////////

/**
 * Models by collection (interface)
 */
export interface MysqlModels extends stores.definitions.mysql.MysqlModels {
  users: {
    Model: users.UserModelCtor;
  };
}

/**
 * Models by collection (entity)
 */
let _models: MysqlModels;

export const models = async (
  s: Sequelize,
  reuse = true
): Promise<MysqlModels> => {
  if (_models) {
    if (reuse) {
      return _models;
    }
  }

  _models = {
    users: {
      Model: definitions.users.createModel(s),
    },
    auditLogs: {
      Model: auditLogs.createModel(s),
    },
  };

  return _models;
};
