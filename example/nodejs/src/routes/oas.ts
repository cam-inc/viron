import { domainsOas } from '@viron/lib';
import { RouteContext } from '.';

// oas取得
export const getOas = async (context: RouteContext): Promise<void> => {
  const oas = await domainsOas.get(context.req._context.apiDefinition);
  context.res.json(oas);
};
