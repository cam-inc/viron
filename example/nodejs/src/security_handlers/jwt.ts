import { AuthenticationResult, ExegesisPluginContext } from 'exegesis-express';
import {
  domainsAuth,
  unauthorized,
  HTTP_HEADER,
  VIRON_AUTHCONFIGS_PATH,
  domainsAdminUser,
  COOKIE_KEY,
} from '@viron/lib';
import {
  AUTHENTICATION_RESULT_TYPE_INVALID,
  AUTHENTICATION_RESULT_TYPE_SUCCESS,
} from '../constants';
import { PluginContext } from '../application';

/**
 * JWT認証
 * - cookieからJWTを取り出して検証
 *   - 検証OKならユーザー情報を取得してロールの検証(TODO)
 *   - 検証NGならヘッダにauthconfigsのパスをセットして401を返却
 */
export const jwt = async (
  context: ExegesisPluginContext
): Promise<AuthenticationResult> => {
  const req = (context as PluginContext).req;
  const token = req.cookies[COOKIE_KEY.VIRON_AUTHORIZATION];
  const claims = token ? await domainsAuth.verifyJwt(token) : false;
  if (claims) {
    const userId = claims.sub;
    const user = await domainsAdminUser.findOneById(userId);
    if (user) {
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
