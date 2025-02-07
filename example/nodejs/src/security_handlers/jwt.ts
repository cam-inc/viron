import {
  AuthenticationFailure,
  AuthenticationResult,
  AuthenticationSuccess,
  ExegesisPluginContext,
} from 'exegesis-express';
import {
  domainsAuth,
  domainsAdminRole,
  domainsAdminUser,
  unauthorized,
  HTTP_HEADER,
  VIRON_AUTHCONFIGS_PATH,
  COOKIE_KEY,
  forbidden,
  AUTH_TYPE,
  VironError,
} from '@viron/lib';
import { AUTHENTICATION_RESULT_TYPE } from '../constants';
import { ctx } from '../context';
import { PluginContext } from '../application';

const authFailure = (err: VironError): AuthenticationFailure => {
  return {
    type: AUTHENTICATION_RESULT_TYPE.INVALID,
    status: err.statusCode,
    message: err.message,
  };
};

const authSuccess = (
  user: domainsAdminUser.AdminUserView
): AuthenticationSuccess => {
  return { type: AUTHENTICATION_RESULT_TYPE.SUCCESS, user };
};

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
  const pContext = context as PluginContext;
  if (!pContext.req.method) {
    return authFailure(unauthorized());
  }
  const method = pContext.req.method.toLowerCase();
  if (!domainsAdminRole.isApiMethod(method)) {
    return authFailure(unauthorized());
  }

  const token = pContext.req.cookies[COOKIE_KEY.VIRON_AUTHORIZATION];
  const claims = await domainsAuth.verifyJwt(token);
  // exegesisのContext外でも使えるように
  pContext.req._context.auth = claims;

  if (claims) {
    const userId = claims.sub;

    if (
      !(await domainsAdminRole.hasPermission(
        userId,
        pContext.req.path,
        method,
        pContext.req._context.apiDefinition
      ))
    ) {
      return authFailure(forbidden());
    }

    const user = await domainsAdminUser.findOneById(userId);
    if (user) {
      switch (user.authType) {
        case AUTH_TYPE.GOOGLE: {
          // Google認証の場合はアクセストークンの検証
          if (
            await domainsAuth.verifyGoogleOAuth2AccessToken(
              userId,
              user,
              ctx.config.auth.googleOAuth2
            )
          ) {
            return authSuccess(user);
          }
          break;
        }
        default:
          return authSuccess(user);
      }
    }
  }

  pContext.origRes.clearCookie(COOKIE_KEY.VIRON_AUTHORIZATION);
  pContext.res.header(
    HTTP_HEADER.X_VIRON_AUTHTYPES_PATH,
    VIRON_AUTHCONFIGS_PATH
  );
  return authFailure(unauthorized());
};
