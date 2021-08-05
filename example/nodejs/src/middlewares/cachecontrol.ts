import { HTTP_HEADER, CACHE_CONTROL } from '@viron/lib';
import { RequestHandler } from 'express';

export const middlewareCacheControl = (): RequestHandler => {
  return (_req, res, next): void => {
    res.setHeader(HTTP_HEADER.CACHE_CONTROL, CACHE_CONTROL.NO_STORE);
    next();
  };
};
