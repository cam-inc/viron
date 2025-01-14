import {
  domainsAuthConfig,
  API_METHOD,
  AUTH_CONFIG_TYPE,
  AUTH_CONFIG_PROVIDER,
  // EMAIL_SIGNIN_PATH,
  SIGNOUT_PATH,
  // OAUTH2_GOOGLE_AUTHORIZATION_PATH,
  // OAUTH2_GOOGLE_CALLBACK_PATH,
  OIDC_AUTHORIZATION_PATH,
} from '@viron/lib';
import { RouteContext } from '../application';

const { genAuthConfigs } = domainsAuthConfig;

// 認証設定一覧
export const listVironAuthconfigs = async (
  context: RouteContext
): Promise<void> => {
  const authConfigDefinitions = [
    // {
    //   provider: AUTH_CONFIG_PROVIDER.VIRON,
    //   type: AUTH_CONFIG_TYPE.EMAIL,
    //   method: API_METHOD.POST,
    //   path: EMAIL_SIGNIN_PATH,
    // },
    // {
    //   provider: AUTH_CONFIG_PROVIDER.GOOGLE,
    //   type: AUTH_CONFIG_TYPE.OAUTH,
    //   method: API_METHOD.GET,
    //   path: OAUTH2_GOOGLE_AUTHORIZATION_PATH,
    // },
    // {
    //   provider: AUTH_CONFIG_PROVIDER.GOOGLE,
    //   type: AUTH_CONFIG_TYPE.OAUTH_CALLBACK,
    //   method: API_METHOD.POST,
    //   path: OAUTH2_GOOGLE_CALLBACK_PATH,
    // },
    {
      provider: AUTH_CONFIG_PROVIDER.GOOGLE,
      type: AUTH_CONFIG_TYPE.OIDC,
      method: API_METHOD.GET,
      path: OIDC_AUTHORIZATION_PATH,
    },
    {
      provider: AUTH_CONFIG_PROVIDER.SIGNOUT,
      type: AUTH_CONFIG_TYPE.SIGNOUT,
      method: API_METHOD.POST,
      path: SIGNOUT_PATH,
    },
  ];
  const result = genAuthConfigs(
    authConfigDefinitions,
    context.req._context.apiDefinition
  );

  context.res.json(result);
};
