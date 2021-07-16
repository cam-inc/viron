import http from 'http';
import express, { Express } from 'express';
import errorHandler from 'errorhandler';
import compression from 'compression';
import { json, urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';
import {
  ExegesisContext,
  ExegesisPluginContext,
  HttpIncomingMessage,
} from 'exegesis-express';
import { domainsOas } from '@viron/lib';
import { register } from './routes';
import { middlewareI18n } from './middlewares/i18n';
import { middlewareNotFound } from './middlewares/notfound';
import { middlewareCors } from './middlewares/cors';
import { middlewareAccessLog } from './middlewares/accesslog';
import { ctx } from './context';

interface RequestContext {
  apiDefinition: domainsOas.VironOpenAPIObject;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      _context: RequestContext;
      cookies: Record<string, string | null | undefined>;
    }
  }
}

interface ExegesisIncomingMessage extends HttpIncomingMessage {
  path: string;
  cookies: Record<string, string | null | undefined>;
  _context: RequestContext;
}

interface ExegesisServerResponse extends http.ServerResponse {
  clearCookie: (key: string) => void;
}

export interface RouteContext extends ExegesisContext {
  req: ExegesisIncomingMessage;
  origRes: ExegesisServerResponse;
}

export interface PluginContext extends ExegesisPluginContext {
  req: ExegesisIncomingMessage;
  origRes: ExegesisServerResponse;
}

export const createApplication = async (): Promise<Express> => {
  // Create Express server
  const app = express();

  // Express configuration
  app.set('host', process.env.SERVICE_HOST || 'localhost');
  app.set('port', process.env.SERVICE_PORT || 3000);

  app.use(compression());
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(middlewareAccessLog());
  app.use(middlewareI18n());
  app.use(middlewareCors(ctx.config.cors));

  // Primary app routes.
  await register(app);

  app.use(middlewareNotFound());
  app.use(errorHandler());

  return app;
};
