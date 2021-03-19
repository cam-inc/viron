import fs from 'fs';
import express, { Express } from 'express';
import errorHandler from 'errorhandler';
import compression from 'compression';
import { json, urlencoded } from 'body-parser';
import { initialize as initExpressOpenapi } from 'express-openapi';
import * as openapiOperations from './routes';
import * as securityHandlers from './security_handlers';

export const createApplication = (): Express => {
  // Create Express server
  const app = express();

  // Express configuration
  app.set('port', process.env.PORT || 3000);
  app.use(compression());
  app.use(json());
  app.use(urlencoded({ extended: true }));

  /**
   * Primary app routes.
   */
  initExpressOpenapi({
    app: app,
    apiDoc: fs.readFileSync(`${__dirname}/openapi.yaml`, 'utf-8'),
    operations: openapiOperations,
    securityHandlers: securityHandlers,
  });

  app.use(errorHandler());

  return app;
};
