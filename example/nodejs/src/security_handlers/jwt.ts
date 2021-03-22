import { Context as RequestContext } from 'openapi-backend';

export const jwt = async (_context: RequestContext): Promise<boolean> => {
  // TODO: implements
  console.log(_context.security);
  console.log(_context.operation);
  return true;
};
