import {
  AuthConfigProvider,
  AuthConfigType,
  ApiMethod,
  OAS_X_AUTHCONFIG_DEFAULT_PARAMETERS,
  OAS_X_AUTHCONFIG_DEFAULT_REQUESTBODY,
} from '../constants';
import { oasUndefined } from '../errors';
import { getDebug } from '../logging';
import {
  VironOpenAPIObject,
  VironPathItemObject,
  VironPathsObject,
} from './oas';

const debug = getDebug('domains:authconfig');

export interface AuthConfig {
  provider: AuthConfigProvider;
  type: AuthConfigType;
  pathObject: VironPathsObject;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultParametersValue?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultRequestBodyValue?: any;
}

export type AuthConfigs = AuthConfig[];

export const genAuthConfig = (
  provider: AuthConfigProvider,
  type: AuthConfigType,
  method: ApiMethod,
  path: string,
  apiDefinition: VironOpenAPIObject
): AuthConfig => {
  const pathItem = apiDefinition.paths[path];
  if (!pathItem) {
    debug('oas undefined path: %s', path);
    throw oasUndefined();
  }
  const operationObject = (pathItem as VironPathItemObject)[method];
  if (!operationObject) {
    debug('oas undefined path: %s, method: %s', path, method);
    throw oasUndefined();
  }

  return {
    provider,
    type,
    pathObject: {
      [path]: {
        [method]: operationObject,
      },
    },
    defaultParametersValue:
      operationObject[OAS_X_AUTHCONFIG_DEFAULT_PARAMETERS],
    defaultRequestBodyValue:
      operationObject[OAS_X_AUTHCONFIG_DEFAULT_REQUESTBODY],
  };
};
