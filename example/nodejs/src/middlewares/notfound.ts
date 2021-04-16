import { RequestHandler } from 'express';
import { notFound } from '../errors';

export const middlewareNotFound = (): RequestHandler => {
  return (_req, _res, next): void => {
    next(notFound());
  };
};
