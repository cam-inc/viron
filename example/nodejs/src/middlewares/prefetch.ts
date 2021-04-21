import { RequestHandler } from 'express';

export const middlewarePrefetch = (): RequestHandler => {
  return (req, res, next): void => {
    if (req.method === 'OPTIONS') {
      return res.end();
    }
    next();
  };
};
