import * as mongoose from 'mongoose';
import { stores } from '@viron/lib';
import * as users from './users';
import * as topics from './topics';

const { auditLogs, createModel } = stores.definitions.mongo;

/////////////////////////////
// Definition
/////////////////////////////

/**
 * Definitions by collection (interface)
 */
export interface MongoDefinitions
  extends stores.definitions.mongo.MongoDefinitions {
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
export interface MongoModels extends stores.definitions.mongo.MongoModels {
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

  _models = {
    users: {
      Model: definitions.users.createModel(
        c,
        definitions.users.name,
        definitions.users.schema
      ),
    },
    topics: {
      Model: definitions.topics.createModel(
        c,
        definitions.topics.name,
        definitions.topics.schema
      ),
    },
    auditLogs: {
      Model: definitions.auditLogs.createModel(
        c,
        definitions.auditLogs.name,
        definitions.auditLogs.schema
      ),
    },
  };

  return _models;
};

// model index signature key
// @see same DefinitionKeys
export type ModelKeys = keyof MongoModels;
