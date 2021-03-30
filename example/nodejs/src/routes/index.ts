import path from 'path';
import { Express, NextFunction, Request, Response } from 'express';
import OpenAPIBackend, {
  Handler,
  Document,
  Context as RequestContext,
  Request as OpenapiRequest,
  Operation,
} from 'openapi-backend';
import merge from 'deepmerge';

import { logger } from '../context';
import { unauthorized } from '../errors';
import * as securityHandlers from '../security_handlers';

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

const openapiPath = (name: string): string =>
  `${__dirname}/../openapi/${name}.yaml`;
// @viron/libが提供しているyamlを参照する用
const libOpenapiDir = `${path.dirname(require.resolve('@viron/lib'))}/openapi`;
const libOpenapiPath = (name: string): string =>
  `${libOpenapiDir}/${name}.yaml`;

const routes: Route[] = [
  { openapiPath: openapiPath('ping'), handlers: routesPing },
  { openapiPath: libOpenapiPath('auditlogs'), handlers: routesAuditLogs },
  { openapiPath: libOpenapiPath('swagger'), handlers: routesSwagger },
  { openapiPath: libOpenapiPath('viron'), handlers: routesViron },
  { openapiPath: libOpenapiPath('authtypes'), handlers: routesAuthtypes },
  // マージ順の関係で`root`は必ず最後に書く
  { openapiPath: openapiPath('root'), handlers: routesRoot },
];

// oasに定義されているAPIが未実装の場合のハンドラ
const notImplemented = async (
  context: RequestContext,
  _req: Request,
  res: Response
): Promise<void> => {
  logger.warn(`Not implemented. ${context.operation.operationId}`);
  if (context.operation.operationId) {
    // モックレスポンス
    const { status, mock } = context.api.mockResponseForOperation(
      context.operation.operationId
    );
    res.status(status).json(mock);
  }
};

// oasに定義がないリクエストをハンドリング
const notFound = async (
  _context: RequestContext,
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  // 次のhandlerに回すのでnextを呼ぶだけ
  next();
};

// securityHandlerでエラーになったリクエストをハンドリング
const unauthorizedHandler = async (
  _context: RequestContext,
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  next(unauthorized());
};

export async function register(app: Express): Promise<void> {
  const apis = await Promise.all(
    routes.map(({ openapiPath, handlers }) => {
      return new OpenAPIBackend({
        definition: openapiPath,
        handlers: {
          ...handlers,
          notFound,
          notImplemented,
          unauthorizedHandler,
        },
        securityHandlers,
      }).init();
    })
  );

  let apiDefinition = {};
  apis.forEach((api) => {
    apiDefinition = merge(apiDefinition, api.definition);
    // add handler
    app.use((req, res, next) =>
      api.handleRequest(
        req as OpenapiRequest,
        req,
        res,
        next,
        apiDefinition as Document
      )
    );
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
