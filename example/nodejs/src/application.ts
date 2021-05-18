import express, { Express } from 'express';
import errorHandler from 'errorhandler';
import compression from 'compression';
import { json, urlencoded } from 'body-parser';
import { register } from './routes';
import { middlewareI18n } from './middlewares/i18n';
import { middlewareNotFound } from './middlewares/notfound';
import { middlewareCors } from './middlewares/cors';
import { middlewareAccessLog } from './middlewares/accesslog';
import { ctx } from './context';

export const createApplication = async (): Promise<Express> => {
  // Create Express server
  const app = express();

  // Express configuration
  app.set('port', process.env.PORT || 3000);

  app.use(compression());
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(middlewareAccessLog());
  app.use(middlewareI18n());
  app.use(middlewareCors(ctx.config.cors));

  // Primary app routes.
  await register(app);

  app.use(middlewareNotFound());
  app.use(errorHandler());

  return app;
};
