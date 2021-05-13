import { AUTH_METHOD, AUTH_TYPE, domainsAuthType, paging } from '@viron/lib';
import { RouteContext } from '.';

const { genAuthType } = domainsAuthType;

/**
 * 認証タイプ一覧
 * @route GET /viron_authtype
 */
export const listVironAuthtypes = async (
  context: RouteContext
): Promise<void> => {
  const authTypes = [
    genAuthType('viron', AUTH_TYPE.EMAIL, AUTH_METHOD.POST, '/signin'),
    genAuthType('viron', AUTH_TYPE.SIGNOUT, AUTH_METHOD.POST, '/signout'),
    genAuthType('google', AUTH_TYPE.OAUTH, AUTH_METHOD.POST, '/google/signin'),
  ];
  context.res.json(paging(authTypes));
};
