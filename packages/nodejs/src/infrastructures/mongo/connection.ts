import mongoose, { ConnectOptions, Connection } from 'mongoose';
import { getDebug } from '../../logging';
const debug = getDebug('infrastructures:mongo:connection');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type openUriEvent = (...args: any) => void;

const wrapEvent = (type: string): openUriEvent => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any): void => {
    debug(`Mongo connection events. type=%s %O`, type, args);
  };
};

export const createConnection = async (
  openUri: string,
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
    debug('Mongo connection failure. openUri=%s', openUri);
    throw new Error('Mongodb Connection Failure');
  }
  debug('Mongo connection successfull. openUri=%s', openUri);

  return c;
};
