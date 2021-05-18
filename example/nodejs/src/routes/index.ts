import path from 'path';
import { Express } from 'express';
import {
  ExegesisContext,
  middleware as genExegesisMiddlewares,
} from 'exegesis-express';
import { OpenAPIObject } from 'openapi3-ts';
import merge from 'deepmerge';
import { loadResolvedOas, domainsOas } from '@viron/lib';

import { logger } from '../context';
import { jwt } from '../security_handlers/jwt';

import * as routesAdminRoles from './adminroles';
import * as routesAdminUsers from './adminusers';
import * as routesAuditLogs from './auditlogs';
import * as routesAuth from './auth';
import * as routesAuthconfigs from './authconfigs';
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
  name: string;
  oasPath: string;
  handlers: Handlers;
}

// oasのパスを取得
export const oasPath = (name: string): string =>
  path.resolve(__dirname, '..', 'openapi', `${name}.yaml`);

const routes: Route[] = [
  { name: 'ping', oasPath: oasPath('ping'), handlers: routesPing },
  { name: 'users', oasPath: oasPath('users'), handlers: routesUsers },
  {
    name: 'adminroles',
    oasPath: domainsOas.getPath('adminroles'),
    handlers: routesAdminRoles,
  },
  {
    name: 'adminusers',
    oasPath: domainsOas.getPath('adminusers'),
    handlers: routesAdminUsers,
  },
  {
    name: 'auditlogs',
    oasPath: domainsOas.getPath('auditlogs'),
    handlers: routesAuditLogs,
  },
  {
    name: 'auth',
    oasPath: domainsOas.getPath('auth'),
    handlers: routesAuth,
  },
  {
    name: 'authconfigs',
    oasPath: domainsOas.getPath('authconfigs'),
    handlers: routesAuthconfigs,
  },
  { name: 'oas', oasPath: domainsOas.getPath('oas'), handlers: routesOas },
  // マージ順の関係で`root`は必ず最後に書く
  { name: 'root', oasPath: oasPath('root'), handlers: routesRoot },
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
    routes.map(async ({ oasPath, handlers, name }) => {
      logger.info('Routes registration oas: %s', oasPath);
      const apiDoc = await loadResolvedOas(oasPath);
      apiDoc['x-exegesis-controller'] = name;
      const middleware = await genExegesisMiddlewares(apiDoc, {
        controllers: {
          [name]: wrapHandlers(handlers),
        },
        authenticators: {
          jwt,
        },
        defaultMaxBodySize: 1024 * 1024,
        allErrors: true,
        treatReturnedJsonAsPure: true,
        autoHandleHttpErrors: false,
      });
      return { middleware, apiDoc };
    })
  );
  apis.forEach(({ middleware, apiDoc }) => {
    app.use(middleware);
    apiDefinition = merge(apiDefinition, apiDoc);
  });
}
