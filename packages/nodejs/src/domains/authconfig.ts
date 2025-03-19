import {
  AuthConfigProvider,
  AuthConfigType,
  ApiMethod,
  OAS_X_AUTHCONFIG_DEFAULT_PARAMETERS,
  OAS_X_AUTHCONFIG_DEFAULT_REQUESTBODY,
  OAS_X_PAGES,
} from '../constants';
import { operationNotFound } from '../errors';
import { findOperation, VironOpenAPIObject, VironPathsObject } from './oas';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultParametersValue?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultRequestBodyValue?: any;
}

export type AuthConfigDefinitions = AuthConfigDefinition[];

const genAuthConfig = (
  provider: AuthConfigProvider,
  type: AuthConfigType,
  method: ApiMethod,
  path: string,
  oas: VironOpenAPIObject,
  defaultParametersValue?: Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultRequestBodyValue?: any
): AuthConfig => {
  const operationObject = findOperation(path, method, oas);
  if (!operationObject) {
    throw operationNotFound();
  }
  return {
    provider,
    type,
    operationId: operationObject.operationId,
    defaultParametersValue: {
      ...operationObject[OAS_X_AUTHCONFIG_DEFAULT_PARAMETERS],
      ...defaultParametersValue,
    },
    defaultRequestBodyValue: {
      ...operationObject[OAS_X_AUTHCONFIG_DEFAULT_REQUESTBODY],
      ...defaultRequestBodyValue,
    },
  };
};

export const genAuthConfigs = (
  defs: AuthConfigDefinitions,
  oas: VironOpenAPIObject
): VironAuthConfigList => {
  const { list, paths } = defs.reduce(
    (ret, def) => {
      const {
        provider,
        type,
        method,
        path,
        defaultParametersValue,
        defaultRequestBodyValue,
      } = def;
      ret.list.push(
        genAuthConfig(
          provider,
          type,
          method,
          path,
          oas,
          defaultParametersValue,
          defaultRequestBodyValue
        )
      );
      ret.paths[path] = ret.paths[path] ?? {};
      const operation = findOperation(path, method, oas);
      if (!operation) {
        throw operationNotFound();
      }
      ret.paths[path][method] = operation;
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
    oas: Object.assign({}, oas, {
      paths,
      info: Object.assign({}, oas.info, { [OAS_X_PAGES]: [] }),
    }),
  };
};
