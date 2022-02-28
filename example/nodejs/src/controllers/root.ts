import { RouteContext } from '../application';

// root
export const getRoot = async (context: RouteContext): Promise<void> => {
  context.res.set('Location', '/oas').status(301).end();
};
