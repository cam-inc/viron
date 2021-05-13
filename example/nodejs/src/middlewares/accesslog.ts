import { RequestHandler } from 'express';
import pino from 'pino';
import pinoHttp from 'pino-http';

const logger = pino({
  name: 'access',
  level: 'debug',
  timestamp: true,
});

export const middlewareAccessLog = (): RequestHandler => {
  return pinoHttp({ logger });
};
