import { BodyParser } from 'exegesis';
import { Request, RequestHandler, Response } from 'express';

import { uploadMedia } from '../repositories/s3/medias';

export interface MultiPartBodyParser {
  handler: RequestHandler;
  postHook?: (req: Request) => Promise<void>;
}

export const multiPart: BodyParser = {
  parseReq(req, res, next) {
    const expressRequest = req as Request;
    const expressResponse = res as Response;

    const { handler, postHook } = uploadMedia(); // medias以外のリポジトリを使用するときはパスなどから判定する

    handler(expressRequest, expressResponse, async (err) => {
      if (err) {
        return next(err);
      }
      if (postHook) {
        await postHook(expressRequest);
      }
      next();
    });
  },
};
