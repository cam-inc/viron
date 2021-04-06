import { Response, Request } from 'express';
import { Context as RequestContext } from 'openapi-backend';
import { constants, domains } from '@viron/lib';

const { AUTH_METHOD, AUTH_TYPE } = constants;
const { genAuthType } = domains.authType;

/**
 * 認証タイプ一覧
 * @route GET /viron_authtype
 */
export const listAuthtypes = async (
  _context: RequestContext,
  _req: Request,
  res: Response
): Promise<void> => {
  const authTypes = [
    genAuthType('viron', AUTH_TYPE.EMAIL, AUTH_METHOD.POST, '/signin'),
    genAuthType('viron', AUTH_TYPE.SIGNOUT, AUTH_METHOD.POST, '/signout'),
    genAuthType('google', AUTH_TYPE.OAUTH, AUTH_METHOD.POST, '/google/signin'),
  ];
  res.json(authTypes);
};
