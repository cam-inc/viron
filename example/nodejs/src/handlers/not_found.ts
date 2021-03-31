import { NextFunction, Request, Response } from 'express';
import { Context as RequestContext } from 'openapi-backend';

// oasに定義がないリクエストをハンドリング
export const notFoundHandler = async (
  _context: RequestContext,
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  // 次のhandlerに回すのでnextを呼ぶだけ
  next();
};
