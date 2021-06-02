import * as mongoose from 'mongoose';
import { storeDefinitions } from '@viron/lib';
import * as users from './users';
import * as topics from './topics';

const { adminUsers, auditLogs, createModel } = storeDefinitions.mongo;

/////////////////////////////
// Definition
/////////////////////////////

/**
 * Definitions by collection (interface)
 */
export interface MongoDefinitions
  extends storeDefinitions.mongo.MongoDefinitions {
  users: {
    name: string;
    schema: mongoose.Schema<
      users.UserDocument,
      mongoose.Model<users.UserDocument>
    >;
    createModel: typeof createModel;
  };
  topics: {
    name: string;
    schema: mongoose.Schema<
      topics.TopicDocument,
      mongoose.Model<topics.TopicDocument>
    >;
    createModel: typeof createModel;
  };
}

/**
 * Definitions by collection (entity)
 */
export const definitions: MongoDefinitions = {
  users: {
    name: users.name,
    schema: users.schema,
    createModel,
  },
  topics: {
    name: topics.name,
    schema: topics.schema,
    createModel,
  },
  adminUsers: {
    name: adminUsers.name,
    schema: adminUsers.schema,
    createModel,
  },
  auditLogs: {
    name: auditLogs.name,
    schema: auditLogs.schema,
    createModel,
  },
};

// definition index signature key
export type DefinitionKeys = keyof MongoDefinitions;

/////////////////////////////
// Model
/////////////////////////////

/**
 * Models by collection (interface)
 */
export interface MongoModels extends storeDefinitions.mongo.MongoModels {
  users: {
    Model: users.UserModel;
  };
  topics: {
    Model: topics.TopicModel;
  };
}

/**
 * Models by collection (entity)
 */
let _models: MongoModels;

/**
 * Get models
 * @param c target mongo connection
 * @param reuse re-use models entity
 */
export const models = async (
  c: mongoose.Connection,
  reuse = true
): Promise<MongoModels> => {
  if (_models) {
    if (reuse) {
      return _models;
    }
  }

  const { users, topics, adminUsers, auditLogs } = definitions;
  _models = {
    users: {
      Model: users.createModel(c, users.name, users.schema),
    },
    topics: {
      Model: topics.createModel(c, topics.name, topics.schema),
    },
    adminUsers: {
      Model: adminUsers.createModel(c, adminUsers.name, adminUsers.schema),
    },
    auditLogs: {
      Model: auditLogs.createModel(c, auditLogs.name, auditLogs.schema),
    },
  };

  return _models;
};

// model index signature key
// @see same DefinitionKeys
export type ModelKeys = keyof MongoModels;
