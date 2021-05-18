import {
  AUTH_METHOD,
  AUTH_CONFIG,
  domainsAuthConfig,
  paging,
} from '@viron/lib';
import { RouteContext } from '.';

const { genAuthConfig } = domainsAuthConfig;

// 認証設定一覧
export const listVironAuthconfigs = async (
  context: RouteContext
): Promise<void> => {
  const authConfigs = [
    genAuthConfig(
      'viron',
      AUTH_CONFIG.EMAIL,
      AUTH_METHOD.POST,
      '/email/signin'
    ),
    genAuthConfig(
      'google',
      AUTH_CONFIG.OAUTH,
      AUTH_METHOD.POST,
      '/google/signin'
    ),
    genAuthConfig('', AUTH_CONFIG.SIGNOUT, AUTH_METHOD.POST, '/signout'),
  ];
  context.res.json(paging(authConfigs));
};
