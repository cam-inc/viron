import { domainsOas, HTTP_HEADER, VIRON_AUTHCONFIGS_PATH } from '@viron/lib';
import { ctx } from '../context';
import { RouteContext } from '../application';

// oas取得
export const getOas = async (context: RouteContext): Promise<void> => {
  const oas = await domainsOas.get(
    context.req._context.apiDefinition,
    ctx.config.oas.infoExtentions,
    context.user?.roleIds
  );
  // ヘッダに x-viron-authtypes-path をセット
  context.res.header(
    HTTP_HEADER.X_VIRON_AUTHTYPES_PATH,
    VIRON_AUTHCONFIGS_PATH
  );
  context.res.json(oas);
};
