import { Express } from 'express';
import OpenAPIBackend, {
  Handler,
  Document,
  Request as OpenapiRequest,
  Operation,
} from 'openapi-backend';
import merge from 'deepmerge';

import { logger } from '../context';
import * as securityHandlers from '../security_handlers';
import { openapiPath, libOpenapiPath } from '../helpers/routes';
import {
  notFoundHandler,
  notImplementedHandler,
  unauthorizedHandler,
} from '../handlers';

import * as routesAuditLogs from './auditlogs';
import * as routesAuthtypes from './authtypes';
import * as routesPing from './ping';
import * as routesRoot from './root';
import * as routesSwagger from './swagger';
import * as routesViron from './viron';

interface Route {
  openapiPath: string;
  handlers: { [operationId: string]: Handler };
}

const routes: Route[] = [
  { openapiPath: openapiPath('ping'), handlers: routesPing },
  { openapiPath: libOpenapiPath('auditlogs'), handlers: routesAuditLogs },
  { openapiPath: libOpenapiPath('swagger'), handlers: routesSwagger },
  { openapiPath: libOpenapiPath('viron'), handlers: routesViron },
  { openapiPath: libOpenapiPath('authtypes'), handlers: routesAuthtypes },
  // マージ順の関係で`root`は必ず最後に書く
  { openapiPath: openapiPath('root'), handlers: routesRoot },
];

export async function register(app: Express): Promise<void> {
  const apis = await Promise.all(
    routes.map(({ openapiPath, handlers }) => {
      return new OpenAPIBackend({
        definition: openapiPath,
        handlers: {
          ...handlers,
          notFound: notFoundHandler,
          notImplemented: notImplementedHandler,
          unauthorizedHandler: unauthorizedHandler,
        },
        securityHandlers,
      }).init();
    })
  );

  let apiDefinition = {};
  apis.forEach((api) => {
    apiDefinition = merge(apiDefinition, api.definition);
    // add handler
    app.use((req, res, next) => {
      api
        .handleRequest(
          req as OpenapiRequest,
          req,
          res,
          next,
          apiDefinition as Document
        )
        .catch(next);
    });
    // logging
    api.router.getOperations().forEach((operation: Operation) => {
      logger.debug(
        `Added routes. %s: %s`,
        operation.method.toUpperCase(),
        operation.path
      );
    });
  });
}
