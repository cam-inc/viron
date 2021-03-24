import { Express, NextFunction, Request, Response } from 'express';
import OpenAPIBackend, {
  Handler,
  Context as RequestContext,
  Request as OpenapiRequest,
} from 'openapi-backend';
import { logger } from '../context';
import { unauthorized } from '../errors';
import * as securityHandlers from '../security_handlers';

import * as routesPing from './ping';

interface Route {
  name: string;
  handlers: { [operationId: string]: Handler };
}
const routes: Route[] = [
  {
    name: 'ping', // YAML file name.
    handlers: routesPing,
  },
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

export function register(app: Express): void {
  routes.forEach(({ name, handlers }) => {
    const api = new OpenAPIBackend({
      definition: `${__dirname}/../openapi/${name}.yaml`,
      handlers: {
        ...handlers,
        notFound,
        notImplemented,
        unauthorizedHandler,
      },
      securityHandlers,
    });

    app.use((req, res, next) =>
      api.handleRequest(req as OpenapiRequest, req, res, next)
    );
  });
}
