import {
  domainsAuthConfig,
  API_METHOD,
  AUTH_CONFIG_TYPE,
  AUTH_CONFIG_PROVIDER,
  EMAIL_SIGNIN_PATH,
  SIGNOUT_PATH,
  OAUTH2_GOOGLE_AUTHORIZATION_PATH,
  OAUTH2_GOOGLE_CALLBACK_PATH,
  OIDC_AUTHORIZATION_PATH,
  OIDC_CALLBACK_PATH,
} from '@viron/lib';
import { RouteContext } from '../application';
import { ctx } from '../context';

const { genAuthConfigs } = domainsAuthConfig;

// 認証設定一覧
export const listVironAuthconfigs = async (
  context: RouteContext
): Promise<void> => {
  const authConfigDefinitions = [
    // メール認証は必須
    {
      provider: AUTH_CONFIG_PROVIDER.VIRON,
      type: AUTH_CONFIG_TYPE.EMAIL,
      method: API_METHOD.POST,
      path: EMAIL_SIGNIN_PATH,
    },
    // サインアウトは必須
    {
      provider: AUTH_CONFIG_PROVIDER.SIGNOUT,
      type: AUTH_CONFIG_TYPE.SIGNOUT,
      method: API_METHOD.POST,
      path: SIGNOUT_PATH,
    },
    // Google認証設定がある場合のみ追加
    ...(ctx.config.auth.googleOAuth2.clientId &&
    ctx.config.auth.googleOAuth2.clientSecret
      ? [
          {
            provider: AUTH_CONFIG_PROVIDER.GOOGLE,
            type: AUTH_CONFIG_TYPE.OAUTH,
            method: API_METHOD.GET,
            path: OAUTH2_GOOGLE_AUTHORIZATION_PATH,
          },
          {
            provider: AUTH_CONFIG_PROVIDER.GOOGLE,
            type: AUTH_CONFIG_TYPE.OAUTH_CALLBACK,
            method: API_METHOD.POST,
            path: OAUTH2_GOOGLE_CALLBACK_PATH,
          },
        ]
      : []),
    // OIDC認証設定がある場合のみ追加
    ...(ctx.config.auth.oidc.clientId &&
    ctx.config.auth.oidc.clientSecret &&
    ctx.config.auth.oidc.configurationUrl
      ? [
          {
            provider: AUTH_CONFIG_PROVIDER.OIDC,
            type: AUTH_CONFIG_TYPE.OIDC,
            method: API_METHOD.GET,
            path: OIDC_AUTHORIZATION_PATH,
          },
          {
            provider: AUTH_CONFIG_PROVIDER.OIDC,
            type: AUTH_CONFIG_TYPE.OIDC_CALLBACK,
            method: API_METHOD.POST,
            path: OIDC_CALLBACK_PATH,
          },
        ]
      : []),
  ];
  const result = genAuthConfigs(
    authConfigDefinitions,
    context.req._context.apiDefinition
  );

  context.res.json(result);
};
