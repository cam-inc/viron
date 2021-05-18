import { AuthConfigProvider, AuthConfigType, AuthMethod } from '../constants';

export interface AuthConfig {
  provider: AuthConfigProvider;
  type: AuthConfigType;
  method: AuthMethod;
  url: string;
}

export type AuthConfigs = AuthConfig[];

export const genAuthConfig = (
  provider: AuthConfigProvider,
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
