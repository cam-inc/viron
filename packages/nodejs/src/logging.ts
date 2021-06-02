import { DEBUG_LOG_PREFIX } from './constants';
import debug from 'debug';

// debugを取得
export const getDebug = (name: string): debug.Debugger => {
  return debug(`${DEBUG_LOG_PREFIX}${name}`);
};
