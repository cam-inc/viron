import express, { Express } from 'express';
import errorHandler from 'errorhandler';
import compression from 'compression';
import { json, urlencoded } from 'body-parser';
import { register } from './routes';
export const createApplication = (): Express => {
  // Create Express server
  const app = express();

  // Express configuration
  app.set('port', process.env.PORT || 3000);
  app.use(compression());
  app.use(json());
  app.use(urlencoded({ extended: true }));

  // Primary app routes.
  register(app);

  app.use(errorHandler());

  return app;
};
