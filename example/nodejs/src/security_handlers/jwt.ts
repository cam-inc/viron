import {
  AuthenticationResult,
  AuthenticatorInfo,
  ExegesisPluginContext,
} from 'exegesis-express';

export const jwt = async (
  _ctx: ExegesisPluginContext,
  securityScheme: AuthenticatorInfo
): Promise<AuthenticationResult> => {
  // TODO: implements
  console.log(securityScheme);
  return { type: 'success' };
};
