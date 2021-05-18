import debug from 'debug';

// loggerを取得
export const getDebug = (name: string): debug.Debugger => {
  const logger = debug(`@viron/lib:${name}`);
  // stdoutに出す
  logger.log = console.log.bind(console);
  return logger;
};
