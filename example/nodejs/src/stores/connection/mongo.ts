import { Connection, ConnectOptions, createConnection } from 'mongoose';
import { Schema } from 'mongoose';
import { logger } from '../../context';

// schemas
import * as topics from '../definitions/mongo/topics';
import * as users from '../definitions/mongo/users';

export interface Definitions {
  [key: string]: Schema;
}

// mongoose.Connection.openUri openUri
type openUri = string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type openUriEvenet = (...args: any) => void;

const wrapEvent = (type: string): openUriEvenet => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any): void => {
    console.log(args); // todo

    logger.info(`openUri events. type=%s %O`, type, args);
  };
};

export const createDefinitions = (): Definitions => {
  const definitions: Definitions = {};
  const merge = (name: string, schema: Schema): void => {
    definitions[name] = schema;
  };
  merge(topics.defaultName, topics.create());
  merge(users.defaultName, users.create());
  return definitions;
};

export const preflight = async (
  openUri: openUri,
  options: ConnectOptions,
  definitions: Definitions
): Promise<Connection> => {
  const c: Connection = createConnection();

  c.on('connecting', wrapEvent('connecting'));
  c.on('connected', wrapEvent('connected'));
  c.on('open', wrapEvent('open'));
  c.on('disconnecting', wrapEvent('disconnecting'));
  c.on('disconnected', wrapEvent('disconnected'));
  c.on('close', wrapEvent('close'));
  c.on('reconnected', wrapEvent('reconnected'));
  c.on('fullsetup', wrapEvent('fullsetup'));
  c.on('all', wrapEvent('all'));
  c.on('reconnectFailed', wrapEvent('reconnectFailed'));
  c.on('reconnectTries', wrapEvent('reconnectTries'));

  await c.openUri(openUri, options);

  if (!c.db) {
    logger.error('Mongo connection failure. openUri=%s', openUri);
    throw new Error('Mongodb Connection Failure');
  }
  logger.info('Mongo connection successfull. openUri=%s', openUri);

  Object.keys(definitions).map((v) => {
    console.log(v, definitions[v]);
  });

  return c;
};
