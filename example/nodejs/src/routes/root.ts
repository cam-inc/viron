import { ExegesisContext } from 'exegesis-express';

/**
 * root
 * @route GET /
 */
export const getRoot = async (context: ExegesisContext): Promise<void> => {
  context.res.set('Location', '/oas').status(301).end();
};
