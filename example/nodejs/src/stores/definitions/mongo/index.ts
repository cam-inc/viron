import * as mongoose from 'mongoose';
import * as users from './users';
import * as topics from './topics';
import * as auditLog from '../../../lib/stores/definitions/mongo/auditlog';
import {
  createModel,
  Definitions as LibDefinitions,
  Models as LibModels,
} from '../../../lib/stores/definitions/mongo';

/////////////////////////////
// Definition
/////////////////////////////

/**
 * Definitions by collection (interface)
 */
export interface Definitions extends LibDefinitions {
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
export const definitions: Definitions = {
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
  auditLog: {
    name: auditLog.name,
    schema: auditLog.schema,
    createModel,
  },
};

// definition index signature key
export type DefinitionKeys = keyof Definitions;

/////////////////////////////
// Model
/////////////////////////////

/**
 * Models by collection (interface)
 */
export interface Models extends LibModels {
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
let _models: Models;

/**
 * Get models
 * @param c target mongo connection
 * @param reuse re-use models entity
 */
export const models = async (
  c: mongoose.Connection,
  reuse = true
): Promise<Models> => {
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
    auditLog: {
      Model: definitions.auditLog.createModel(
        c,
        definitions.auditLog.name,
        definitions.auditLog.schema
      ),
    },
  };

  return _models;
};

// model index signature key
// @see same DefinitionKeys
export type ModelKeys = keyof Models;
