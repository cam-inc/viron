import { AuthConfig, AuthMethod } from '../constants';

export interface AuthType {
  provider: string;
  type: AuthConfig;
  method: AuthMethod;
  url: string;
}

export type AuthTypes = AuthType[];

export const genAuthConfig = (
  provider: string,
  type: AuthConfig,
  method: AuthMethod,
  url: string
): AuthType => {
  return {
    provider,
    type,
    method,
    url,
  };
};
