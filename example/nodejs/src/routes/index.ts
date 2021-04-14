import { Express } from 'express';
import {
  ExegesisContext,
  middleware as genExegesisMiddlewares,
} from 'exegesis-express';
import { OpenAPIObject } from 'openapi3-ts';
import merge from 'deepmerge';
import { loadResolvedOpenapi } from '@viron/lib';

import { logger } from '../context';
import * as securityHandlers from '../security_handlers';
import { openapiPath, libOpenapiPath } from '../helpers/routes';

import * as routesAuditLogs from './auditlogs';
import * as routesAuthtypes from './authtypes';
import * as routesPing from './ping';
import * as routesRoot from './root';
import * as routesOas from './oas';
import * as routesUsers from './users';

export interface RouteContext extends ExegesisContext {
  apiDefinition: OpenAPIObject;
}

type Handler = (context: RouteContext) => Promise<void>;

interface Handlers {
  [name: string]: Handler;
}

interface Route {
  openapiPath: string;
  handlers: Handlers;
}

const routes: Route[] = [
  { openapiPath: openapiPath('ping'), handlers: routesPing },
  { openapiPath: openapiPath('users'), handlers: routesUsers },
  { openapiPath: libOpenapiPath('auditlogs'), handlers: routesAuditLogs },
  { openapiPath: libOpenapiPath('authtypes'), handlers: routesAuthtypes },
  { openapiPath: libOpenapiPath('oas'), handlers: routesOas },
  // マージ順の関係で`root`は必ず最後に書く
  { openapiPath: openapiPath('root'), handlers: routesRoot },
];

export async function register(app: Express): Promise<void> {
  let apiDefinition = {};

  // apiDefinitionをroutesで扱えるようにするためコンテキストに追加する
  const wrap = (fn: Handler): Handler => {
    return async (context: RouteContext): Promise<void> => {
      context.apiDefinition = apiDefinition as OpenAPIObject;
      return fn(context);
    };
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wrapHandlers = (handlers: Handlers): any => {
    return Object.keys(handlers).reduce((ret: Handlers, name: string) => {
      ret[name] = wrap(handlers[name]);
      return ret;
    }, {});
  };

  const apis = await Promise.all(
    routes.map(async ({ openapiPath, handlers }) => {
      logger.info('Routes registration oas: %s', openapiPath);
      const apiDoc = await loadResolvedOpenapi(openapiPath);
      const controllerName = 'example';
      apiDoc['x-exegesis-controller'] = controllerName;
      const middleware = await genExegesisMiddlewares(apiDoc, {
        controllers: {
          [controllerName]: wrapHandlers(handlers),
        },
        authenticators: securityHandlers,
        defaultMaxBodySize: 1024 * 1024,
        allErrors: true,
        treatReturnedJsonAsPure: true,
      });
      return { middleware, apiDoc };
    })
  );
  apis.forEach(({ middleware, apiDoc }) => {
    app.use(middleware);
    apiDefinition = merge(apiDefinition, apiDoc);
  });
}
