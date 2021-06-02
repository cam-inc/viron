import { AuthenticationResult, ExegesisPluginContext } from 'exegesis-express';
import {
  domainsAuth,
  unauthorized,
  HTTP_HEADER,
  VIRON_AUTHCONFIGS_PATH,
  domainsAdminUser,
} from '@viron/lib';
import {
  AUTHENTICATION_RESULT_TYPE_INVALID,
  AUTHENTICATION_RESULT_TYPE_SUCCESS,
} from '../constants';

export const jwt = async (
  context: ExegesisPluginContext
): Promise<AuthenticationResult> => {
  const params = await context.getParams();
  const token = params.header[HTTP_HEADER.AUTHORIZATION];
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
