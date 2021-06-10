import { domainsOas } from '@viron/lib';
import { ctx } from '../context';
import { RouteContext } from '../application';

// oas取得
export const getOas = async (context: RouteContext): Promise<void> => {
  const oas = await domainsOas.get(
    context.req._context.apiDefinition,
    ctx.config.oas.infoExtentions
  );
  context.res.json(oas);
};
