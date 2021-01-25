import express, { Express } from 'express';
import errorHandler from 'errorhandler';
import compression from 'compression';
import bodyParser from 'body-parser';
//
import { getPing } from './routes/ping';

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

  app.use(errorHandler());

  return app;
};
