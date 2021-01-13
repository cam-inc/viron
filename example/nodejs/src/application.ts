import express, { Express } from 'express';
import compression from 'compression'; // compresses requests
import bodyParser from 'body-parser';
// Controllers (route handlers)
import { getPing } from './route/ping';

export const createApplication = (): Express => {
  // Create Express server
  const app = express();

  // Express configuration
  app.set('port', process.env.PORT || 3000);
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  /**
   * Primary app routes.
   */
  app.get('/ping', getPing);

  return app;
};
