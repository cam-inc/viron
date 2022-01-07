import { RouteContext } from '../application';

// Ping
export const getPing = async (context: RouteContext): Promise<void> => {
  context.res.setBody('pong');
};
