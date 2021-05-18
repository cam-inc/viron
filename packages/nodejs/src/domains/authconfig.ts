import { AuthConfigType, AuthMethod } from '../constants';

export interface AuthConfig {
  provider: string;
  type: AuthConfigType;
  method: AuthMethod;
  url: string;
}

export type AuthConfigs = AuthConfig[];

export const genAuthConfig = (
  provider: string,
  type: AuthConfigType,
  method: AuthMethod,
  url: string
): AuthConfig => {
  return {
    provider,
    type,
    method,
    url,
  };
};
