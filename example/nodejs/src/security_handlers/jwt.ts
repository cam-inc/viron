import {
  AuthenticationResult,
  AuthenticatorInfo,
  ExegesisPluginContext,
} from 'exegesis-express';
//import { HTTP_HEADER } from '@viron/lib';
//import { unauthorized } from '../errors';
//import { VIRON_AUTHTYPES_PATH } from '../constants';

export const jwt = async (
  //context: ExegesisPluginContext,
  _context: ExegesisPluginContext,
  securityScheme: AuthenticatorInfo
): Promise<AuthenticationResult> => {
  // TODO: implements
  console.log(securityScheme);
  return { type: 'success' };
  //const e = unauthorized();
  //context.origRes.setHeader(
  //  HTTP_HEADER.X_VIRON_AUTHTYPES_PATH,
  //  VIRON_AUTHTYPES_PATH
  //);
  //return { type: 'invalid', status: e.statusCode, message: e.message };
};
