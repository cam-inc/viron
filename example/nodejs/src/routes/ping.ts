import { Response, Request } from 'express';

/**
 * Ping
 * @route GET /ping
 */
export const getPing = (_req: Request, res: Response): void => {
  console.log(`process.env.MODE=${process.env.MODE}`);
  res.send('pong');
};
