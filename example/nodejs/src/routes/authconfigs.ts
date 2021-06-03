import {
  domainsAuthConfig,
  paging,
  API_METHOD,
  AUTH_CONFIG_TYPE,
  AUTH_CONFIG_PROVIDER,
  EMAIL_SIGNIN_PATH,
  //GOOGLE_SIGNIN_PATH,
  SIGNOUT_PATH,
} from '@viron/lib';
import { RouteContext } from '../application';

const { genAuthConfig } = domainsAuthConfig;

// 認証設定一覧
export const listVironAuthconfigs = async (
  context: RouteContext
): Promise<void> => {
  const authConfigs = [
    genAuthConfig(
      AUTH_CONFIG_PROVIDER.VIRON,
      AUTH_CONFIG_TYPE.EMAIL,
      API_METHOD.POST,
      EMAIL_SIGNIN_PATH,
      context.apiDefinition
    ),
    // TODO: Google認証
    //genAuthConfig(
    //  AUTH_CONFIG_PROVIDER.GOOGLE,
    //  AUTH_CONFIG_TYPE.OAUTH,
    //  API_METHOD.POST,
    //  GOOGLE_SIGNIN_PATH,
    //  context.apiDefinition
    //),
    genAuthConfig(
      AUTH_CONFIG_PROVIDER.SIGNOUT,
      AUTH_CONFIG_TYPE.SIGNOUT,
      API_METHOD.POST,
      SIGNOUT_PATH,
      context.apiDefinition
    ),
  ];
  context.res.json(paging(authConfigs));
};
