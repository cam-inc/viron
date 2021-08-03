import {
  AuthConfigProvider,
  AuthConfigType,
  ApiMethod,
  OAS_X_AUTHCONFIG_DEFAULT_PARAMETERS,
  OAS_X_AUTHCONFIG_DEFAULT_REQUESTBODY,
  OAS_X_PAGES,
} from '../constants';
import { oasUndefined } from '../errors';
import { getDebug } from '../logging';
import {
  VironOpenAPIObject,
  VironOperationObject,
  VironPathItemObject,
  VironPathsObject,
} from './oas';

const debug = getDebug('domains:authconfig');

export interface AuthConfig {
  provider: AuthConfigProvider;
  type: AuthConfigType;
  operationId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultParametersValue?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultRequestBodyValue?: any;
}

export type AuthConfigs = AuthConfig[];

export interface VironAuthConfigList {
  list: AuthConfigs;
  oas: VironOpenAPIObject;
}

export interface AuthConfigDefinition {
  provider: AuthConfigProvider;
  type: AuthConfigType;
  method: ApiMethod;
  path: string;
}

export type AuthConfigDefinitions = AuthConfigDefinition[];

const getOperation = (
  method: ApiMethod,
  path: string,
  apiDefinition: VironOpenAPIObject
): VironOperationObject => {
  const pathItem = apiDefinition.paths[path];
  if (!pathItem) {
    debug('oas undefined path: %s', path);
    throw oasUndefined();
  }
  const operationObject = (pathItem as VironPathItemObject)[method];
  if (!operationObject || !operationObject.operationId) {
    debug('oas undefined path: %s, method: %s', path, method);
    throw oasUndefined();
  }
  return operationObject as VironOperationObject;
};

const genAuthConfig = (
  provider: AuthConfigProvider,
  type: AuthConfigType,
  method: ApiMethod,
  path: string,
  apiDefinition: VironOpenAPIObject
): AuthConfig => {
  const operationObject = getOperation(method, path, apiDefinition);
  return {
    provider,
    type,
    operationId: operationObject.operationId,
    defaultParametersValue:
      operationObject[OAS_X_AUTHCONFIG_DEFAULT_PARAMETERS],
    defaultRequestBodyValue:
      operationObject[OAS_X_AUTHCONFIG_DEFAULT_REQUESTBODY],
  };
};

export const genAuthConfigs = (
  defs: AuthConfigDefinitions,
  apiDefinition: VironOpenAPIObject
): VironAuthConfigList => {
  const { list, paths } = defs.reduce(
    (ret, def) => {
      const { provider, type, method, path } = def;
      ret.list.push(genAuthConfig(provider, type, method, path, apiDefinition));
      ret.paths[path] = ret.paths[path] ?? {};
      ret.paths[path][method] = getOperation(method, path, apiDefinition);
      return ret;
    },
    {
      list: [],
      paths: {},
    } as { list: AuthConfigs; paths: VironPathsObject }
  );
  return {
    list,
    // 非ログイン状態で見られるため不要なものは消す
    oas: Object.assign({}, apiDefinition, {
      paths,
      info: Object.assign({}, apiDefinition.info, { [OAS_X_PAGES]: [] }),
    }),
  };
};
