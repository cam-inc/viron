import { domainsOas } from '@viron/lib';
import { RouteContext } from '../application';

// oas取得
export const getOas = async (context: RouteContext): Promise<void> => {
  const oas = await domainsOas.get(context.apiDefinition);
  context.res.json(oas);
};
