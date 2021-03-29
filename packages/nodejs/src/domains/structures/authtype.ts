import { AuthTypeMethod, AuthTypeType } from '../../constants';

export interface AuthType {
  provider: string;
  type: AuthTypeType;
  method: AuthTypeMethod;
  url: string;
}

export type AuthTypes = AuthType[];

export const genAuthType = (
  provider: string,
  type: AuthTypeType,
  method: AuthTypeMethod,
  url: string
): AuthType => {
  return {
    provider,
    type,
    method,
    url,
  };
};
