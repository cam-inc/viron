import { Response, Request } from 'express';

/**
 * Ping
 * @route GET /ping
 */
export const getPing = (_req: Request, res: Response): void => {
  res.send('pong');
};
