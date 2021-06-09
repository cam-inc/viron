import { AuthenticationResult, ExegesisPluginContext } from 'exegesis-express';
import {
  domainsAuth,
  domainsAdminRole,
  domainsAdminUser,
  unauthorized,
  HTTP_HEADER,
  VIRON_AUTHCONFIGS_PATH,
  ApiMethod,
  COOKIE_KEY,
  forbidden,
} from '@viron/lib';
import {
  AUTHENTICATION_RESULT_TYPE_INVALID,
  AUTHENTICATION_RESULT_TYPE_SUCCESS,
} from '../constants';
import { PluginContext } from '../application';

/**
 * JWT認証
 * - cookieからJWTを取り出して検証
 *   - 検証OKならロールを検証
 *     - ロールもOKならユーザー情報を取得
 *     - NGなら403を返却
 *   - 検証NGならヘッダにauthconfigsのパスをセットして401を返却
 */
export const jwt = async (
  context: ExegesisPluginContext
): Promise<AuthenticationResult> => {
  const ctx = context as PluginContext;
  const token = ctx.req.cookies[COOKIE_KEY.VIRON_AUTHORIZATION];
  const claims = token ? await domainsAuth.verifyJwt(token) : false;

  if (claims) {
    const userId = claims.sub;

    if (
      ctx.req.method &&
      !(await domainsAdminRole.hasPermission(
        userId,
        ctx.req.path,
        ctx.req.method.toLowerCase() as ApiMethod,
        ctx.req._context.apiDefinition
      ))
    ) {
      const e = forbidden();
      return {
        type: AUTHENTICATION_RESULT_TYPE_INVALID,
        status: e.statusCode,
        message: e.message,
      };
    }

    const user = await domainsAdminUser.findOneById(userId);
    if (user) {
      // TODO: Google認証の場合はアクセストークンの検証
      return { type: AUTHENTICATION_RESULT_TYPE_SUCCESS, user };
    }
  }

  context.origRes.setHeader(
    HTTP_HEADER.X_VIRON_AUTHTYPES_PATH,
    VIRON_AUTHCONFIGS_PATH
  );
  const e = unauthorized();
  return {
    type: AUTHENTICATION_RESULT_TYPE_INVALID,
    status: e.statusCode,
    message: e.message,
  };
};
