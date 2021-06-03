import { OpenAPIObject, PathItemObject, PathsObject } from 'openapi3-ts';
import { AuthConfigProvider, AuthConfigType, ApiMethod } from '../constants';
import { oasUndefined } from '../errors';
import { getDebug } from '../logging';

const debug = getDebug('domains:authconfig');

export interface AuthConfig {
  provider: AuthConfigProvider;
  type: AuthConfigType;
  pathObject: PathsObject;
}

export type AuthConfigs = AuthConfig[];

export const genAuthConfig = (
  provider: AuthConfigProvider,
  type: AuthConfigType,
  method: ApiMethod,
  path: string,
  apiDefinition: OpenAPIObject
): AuthConfig => {
  const pathItem = apiDefinition.paths[path];
  if (!pathItem) {
    debug('oas undefined path: %s', path);
    throw oasUndefined();
  }
  const operationObject = (pathItem as PathItemObject)[method];
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
  };
};
