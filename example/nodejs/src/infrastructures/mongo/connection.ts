import mongoose, { ConnectOptions, Connection } from 'mongoose';
import { MongoConfig } from '../../config';
import { logger } from '../../context';
import { MODE, StoreType } from '../../constants';
import { models, MongoModels } from './models';

// mongoose.Connection.openUri openUri
export type openUri = string;

export interface MongoStore {
  type: StoreType;
  models: MongoModels;
  instance: Connection;
}

export const preflight = async (config: MongoConfig): Promise<MongoStore> => {
  mongoose.set('debug', true);
  const c = await createConnection(config.openUri, config.connectOptions);

  return {
    type: MODE.MONGO,
    models: models(c),
    instance: c,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type openUriEvenet = (...args: any) => void;

const wrapEvent = (type: string): openUriEvenet => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any): void => {
    logger.info(`openUri events. type=%s %O`, type, args);
  };
};

export const createConnection = async (
  openUri: openUri,
  options: ConnectOptions
): Promise<Connection> => {
  const c: Connection = mongoose.createConnection();

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

  return c;
};
