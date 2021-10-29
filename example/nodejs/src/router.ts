import { Express } from 'express';
import { middleware as genExegesisMiddleware } from 'exegesis-express';
import merge from 'deepmerge';
import { domainsOas } from '@viron/lib';

import { RouteContext } from './application';
import { logger } from './context';
import { jwt } from './security_handlers/jwt';
import { multiPart } from './parser/multipart';

type Controller = (context: RouteContext) => Promise<void>;

interface Controllers {
  [name: string]: Controller;
}

export interface Route {
  name: string;
  oasPath: string;
  controllers: Controllers;
}

export async function register(app: Express, routes: Route[]): Promise<void> {
  let apiDefinition = {};

  // apiDefinitionをmiddlewareで扱えるようにするためリクエストに追加する
  app.use((req, _res, next) => {
    req._context = {
      apiDefinition: apiDefinition as domainsOas.VironOpenAPIObject,
      auth: null,
    };
    next();
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wrapControllers = (controllers: Controllers): any => {
    return Object.keys(controllers).reduce((ret: Controllers, name: string) => {
      ret[name] = controllers[name];
      return ret;
    }, {});
  };

  const apis = await Promise.all(
    routes.map(async ({ oasPath, controllers, name }) => {
      logger.info('Routes registration oas: %s', oasPath);

      const apiDoc = await domainsOas.loadResolvedOas(oasPath).catch((e) => {
        logger.error('Load Openapi failure. oas: %s', oasPath);
        throw e;
      });

      apiDoc['x-exegesis-controller'] = name;
      const middleware = await genExegesisMiddleware(apiDoc, {
        controllers: {
          [name]: wrapControllers(controllers),
        },
        authenticators: {
          jwt,
        },
        mimeTypeParsers: {
          'multipart/form-data': multiPart,
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
