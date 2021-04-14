import { Request, Response } from 'express';
import { Context as RequestContext } from 'openapi-backend';
import { logger } from '../context';

// oasに定義されているAPIが未実装の場合のハンドラ
export const notImplementedHandler = async (
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
