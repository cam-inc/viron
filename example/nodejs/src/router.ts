import { Express } from 'express';
import {
  middleware as genExegesisMiddleware,
  MiddlewareFunction,
} from 'exegesis-express';
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const wrapControllers = (controllers: Controllers): any => {
  return Object.keys(controllers).reduce((ret: Controllers, name: string) => {
    ret[name] = controllers[name];
    return ret;
  }, {});
};

const loadOas = async (
  oasPath: string
): Promise<domainsOas.VironOpenAPIObject> => {
  return await domainsOas.loadResolvedOas(oasPath).catch((e) => {
    logger.error('Load Openapi failure. oas: %s', oasPath);
    throw e;
  });
};

const genMiddleware = async (
  route: Route
): Promise<[MiddlewareFunction, domainsOas.VironOpenAPIObject]> => {
  const { oasPath, controllers, name } = route;
  logger.info('Routes registration oas: %s', oasPath);

  const apiDoc = await loadOas(oasPath);
  const middleware = await genExegesisMiddleware(
    Object.assign({ 'x-exegesis-controller': name }, apiDoc),
    {
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
    }
  ).catch((e) => {
    logger.error('Generating exegesis middleware failure. oas: %s', oasPath);
    throw e;
  });
  return [middleware, apiDoc];
};

export async function register(app: Express, routes: Route[]): Promise<void> {
  let apiDefinition: domainsOas.VironOpenAPIObject = {
    openapi: '3.0.2',
    info: { title: '', version: '' },
    paths: {},
  };

  app.use((req, _res, next) => {
    // apiDefinitionをmiddlewareで扱えるようにするためリクエストに追加する
    req._context = { apiDefinition, auth: null };
    next();
  });

  // ExegesisMiddlewareを生成してルータに登録
  const apis = await Promise.all(routes.map(genMiddleware));
  apis.forEach(([middleware, apiDoc]) => {
    app.use(middleware);
    apiDefinition = domainsOas.merge(apiDefinition, apiDoc);
  });
  apiDefinition = await domainsOas.dereference(apiDefinition);

  logger.debug('register routes finish. apiDefinition: %o', apiDefinition);
}
