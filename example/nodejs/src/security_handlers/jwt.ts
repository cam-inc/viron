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
  VironError,
  domainsAdminUserSsoToken,
  AUTH_PROVIDER,
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

const authFailureAndClearCookie = (
  context: PluginContext,
  err: VironError
): AuthenticationFailure => {
  context.origRes.clearCookie(COOKIE_KEY.VIRON_AUTHORIZATION);
  context.res.header(
    HTTP_HEADER.X_VIRON_AUTHTYPES_PATH,
    VIRON_AUTHCONFIGS_PATH
  );
  return authFailure(err);
};

const authSuccess = (
  user: domainsAdminUser.AdminUserWithCredential
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
    console.error('req.method is undefined');
    return authFailure(unauthorized());
  }

  const method = pContext.req.method.toLowerCase();
  if (!domainsAdminRole.isApiMethod(method)) {
    console.error('method is invalid');
    return authFailure(unauthorized());
  }

  const token = pContext.req.cookies[COOKIE_KEY.VIRON_AUTHORIZATION];
  if (!token) {
    console.error('header jwt token is invalid');
    return authFailureAndClearCookie(pContext, unauthorized());
  }

  const claims = await domainsAuth.verifyJwt(token, pContext.req);
  // exegesisのContext外でも使えるように
  pContext.req._context.auth = claims;

  // claimsがない場合はエラー
  if (!claims) {
    console.error('claims is invalid');
    return authFailureAndClearCookie(pContext, unauthorized());
  }
  const userId = claims.sub;

  // 権限がない場合はエラー
  if (
    !(await domainsAdminRole.hasPermission(
      userId,
      pContext.req.path,
      method,
      pContext.req._context.apiDefinition
    ))
  ) {
    console.error('role is invalid');
    return authFailure(forbidden());
  }

  // credentialsありでユーザー情報取得
  const user = await domainsAdminUser.findOneWithCredentialById(userId);

  // ユーザーが存在しない場合とaudがない場合はエラー
  if (!user || !claims.aud) {
    console.error('user or aud is invalid');
    return authFailureAndClearCookie(pContext, unauthorized());
  }

  // SSOトークンを取得
  const clientId = claims.aud[0];
  const ssoToken = await domainsAdminUserSsoToken.findOneByClientIdAndUserId(
    clientId,
    userId
  );

  // SSOトークンが存在する & パスワードがある場合はpassword認証なので成功
  if (
    ssoToken &&
    user &&
    (user as domainsAdminUser.AdminUserWithCredential).password
  ) {
    return authSuccess(user as domainsAdminUser.AdminUserWithCredential);
  }

  // SSOトークンが存在しない & パスワードない場合はエラー
  if (
    !ssoToken &&
    user &&
    !(user as domainsAdminUser.AdminUserWithCredential).password
  ) {
    console.error('ssoToken is invalid or password is invalid');
    return authFailureAndClearCookie(pContext, unauthorized());
  }

  // SSOトークンが存在する場合は検証
  // audの最初の要素にclientIDを設定している
  if (ssoToken) {
    switch (ssoToken.provider) {
      case AUTH_PROVIDER.GOOGLE: {
        // Google認証の場合はアクセストークンの検証
        if (
          await domainsAuth.verifyGoogleOAuth2AccessToken(
            clientId,
            userId,
            ssoToken,
            ctx.config.auth.googleOAuth2
          )
        ) {
          return authSuccess(user as domainsAdminUser.AdminUserWithCredential);
        }
        break;
      }
      case AUTH_PROVIDER.CUSTOM: {
        // OIDC認証の場合はアクセストークンの検証
        const client = await domainsAuth.genOidcClient(ctx.config.auth.oidc);
        if (
          await domainsAuth.verifyOidcAccessToken(
            client,
            ctx.config.auth.oidc,
            clientId,
            userId,
            ssoToken
          )
        ) {
          return authSuccess(user as domainsAdminUser.AdminUserWithCredential);
        }
        break;
      }
    }
  }
  console.error('ssoToken is invalid', ssoToken);
  return authFailure(unauthorized());
};
