import path from 'path';
import { Express } from 'express';
import { middleware as genExegesisMiddlewares } from 'exegesis-express';
import merge from 'deepmerge';
import { domainsOas } from '@viron/lib';

import { RouteContext } from '../application';
import { logger } from '../context';
import { jwt } from '../security_handlers/jwt';

import * as routesAdminAccounts from './adminaccounts';
import * as routesAdminRoles from './adminroles';
import * as routesAdminUsers from './adminusers';
import * as routesAuditLogs from './auditlogs';
import * as routesAuth from './auth';
import * as routesAuthconfigs from './authconfigs';
import * as routesPing from './ping';
import * as routesPurchases from './purchases';
import * as routesResources from './resources';
import * as routesRoot from './root';
import * as routesOas from './oas';
import * as routesUsers from './users';

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
  {
    name: 'purchases',
    oasPath: oasPath('purchases'),
    handlers: routesPurchases,
  },
  {
    name: 'resources',
    oasPath: oasPath('resources'),
    handlers: routesResources,
  },
  { name: 'users', oasPath: oasPath('users'), handlers: routesUsers },
  {
    name: 'adminaccounts',
    oasPath: domainsOas.getPath('adminaccounts'),
    handlers: routesAdminAccounts,
  },
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

  // apiDefinitionをmiddlewareで扱えるようにするためリクエストに追加する
  app.use((req, _res, next) => {
    req._context = {
      apiDefinition: apiDefinition as domainsOas.VironOpenAPIObject,
    };
    next();
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wrapHandlers = (handlers: Handlers): any => {
    return Object.keys(handlers).reduce((ret: Handlers, name: string) => {
      ret[name] = handlers[name];
      return ret;
    }, {});
  };

  const apis = await Promise.all(
    routes.map(async ({ oasPath, handlers, name }) => {
      logger.info('Routes registration oas: %s', oasPath);

      const apiDoc = await domainsOas.loadResolvedOas(oasPath).catch((e) => {
        logger.error('Load Openapi failure. oas: %s', oasPath);
        throw e;
      });

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
      }).catch((e) => {
        logger.error(
          'Generating exegesis middleware failure. oas: %s',
          oasPath
        );
        throw e;
      });
      return { middleware, apiDoc };
    })
  );

  apis.forEach(({ middleware, apiDoc }) => {
    app.use(middleware);
    apiDefinition = merge(apiDefinition, apiDoc);
  });

  logger.info('register routes finish. apiDefinition: %o', apiDefinition);
}
