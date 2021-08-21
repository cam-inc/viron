import _ from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FieldError, UseFormReturn } from 'react-hook-form';
import { ENVIRONMENTAL_VARIABLE } from '$constants/index';
import { Endpoint } from '$types/index';
import { Document, Schema } from '$types/oas';
import { promiseErrorHandler } from '$utils/index';
import {
  constructRequestInfo,
  constructRequestInit,
  constructRequestPayloads,
  cleanupRequestValue,
  getAutocompleteSetting,
  getRequest,
  replaceEnvironmentalVariableOfDefaultRequestParametersValue,
} from '$utils/oas';

export type UseActiveReturn = {
  isActive: boolean;
  isActiveSwitchable: boolean;
  activate: () => void;
  inactivate: () => void;
  switchActive: () => void;
};
export const useActive = function ({
  name,
  required,
  map,
  getValues,
}: {
  name: string;
  schema: Schema;
  required: boolean;
  map: UseEliminateReturn['ref'];
  getValues: UseFormReturn['getValues'];
}): UseActiveReturn {
  // The `require` parameter in OAS usually means that a key-value pair exists.
  const [isActive, setIsActive] = useState<boolean>(
    required || !_.isUndefined(getValues(name))
  );
  const activate = useCallback(function () {
    setIsActive(true);
  }, []);
  const inactivate = useCallback(
    function () {
      // If required, a key-value pair must exist which means inactivation is not allowed.
      if (required) {
        return;
      }
      setIsActive(false);
    },
    [required]
  );
  const switchActive = useCallback(
    function () {
      if (isActive) {
        inactivate();
      } else {
        activate();
      }
    },
    [isActive, activate, inactivate]
  );

  useEffect(
    function () {
      map.current[name] = isActive;
    },
    [name, isActive, map]
  );

  return {
    isActive,
    isActiveSwitchable: !required,
    activate,
    inactivate,
    switchActive,
  };
};

export type UseEliminateReturn = {
  ref: React.MutableRefObject<{ [key in string]: boolean }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: (data: { [key in string]: any }) => void;
};
export const useEliminate = function (): UseEliminateReturn {
  const ref = useRef<{ [key in string]: boolean }>({});
  const execute = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function (data: { [key in string]: any }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const f = function (prefix: string, data: any) {
        if (_.isObject(data)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data = data as { [key in string]: any };
          _.forEach(data, function (value, key) {
            const deepKey = !!prefix ? `${prefix}.${key}` : key;
            if (ref.current[deepKey]) {
              f(deepKey, value);
            } else {
              delete data[key];
            }
          });
          return;
        }
        if (_.isArray(data)) {
          data.forEach(function (value, index) {
            f(`${prefix}.${index}`, value);
          });
        }
      };
      f('', data);
    },
    [ref]
  );
  return {
    ref,
    execute,
  };
};

export const useError = function ({
  schema,
  name,
  errors,
}: {
  schema: Schema;
  name: string;
  errors: UseFormReturn['formState']['errors'];
}): FieldError | null {
  const nameForError = useNameForError({ schema, name });
  const error = _.get(errors, nameForError);
  if (!error) {
    return null;
  }
  return error as FieldError;
};

export const useNameForError = function ({
  schema,
  name,
}: {
  schema: Schema;
  name: string;
}): string {
  return useMemo<string>(
    function () {
      if (schema.type === 'array') {
        return `${name}_array`;
      }
      if (schema.type === 'object') {
        return `${name}_object`;
      }
      return name;
    },
    [schema, name]
  );
};

export type UseAutocompleteReturn<T> = {
  isEnabled: boolean;
  datalist: {
    value: T;
    label?: string;
  }[];
  id: string;
};
export const useAutocomplete = function <T>(
  endpoint: Endpoint,
  document: Document,
  schema: Schema,
  payload: T
): UseAutocompleteReturn<T> {
  const [isEnabled, setIsEnabled] = useState<boolean>(
    !!schema['x-autocomplete']
  );
  const [datalist, setDatalist] = useState<
    UseAutocompleteReturn<T>['datalist']
  >([]);

  useEffect(
    function () {
      const autocomplete = schema['x-autocomplete'];
      if (!autocomplete) {
        setIsEnabled(false);
        return;
      }
      const getAutocompleteSettingResult = getAutocompleteSetting(
        document.info
      );
      if (getAutocompleteSettingResult.isFailure()) {
        setIsEnabled(false);
        return;
      }
      const autocompleteSetting = getAutocompleteSettingResult.value;
      setIsEnabled(true);
      const getRequestResult = getRequest(document, {
        operationId: autocomplete.operationId,
      });
      if (getRequestResult.isFailure()) {
        // TODO: エラー処理。
        return;
      }
      const request = getRequestResult.value;
      const requestValue = cleanupRequestValue(request, {
        parameters:
          replaceEnvironmentalVariableOfDefaultRequestParametersValue<T>(
            autocomplete.defaultParametersValue,
            {
              [ENVIRONMENTAL_VARIABLE.AUTOCOMPLETE_VALUE]: payload,
            }
          ),
        requestBody: autocomplete.defaultRequestBodyValue,
      });
      const f = async function () {
        const requestPayloads = constructRequestPayloads(
          request.operation,
          requestValue
        );
        const requestInfo = constructRequestInfo(
          endpoint,
          document,
          request,
          requestPayloads
        );
        const requestInit = constructRequestInit(request, requestPayloads);
        const [response, responseError] = await promiseErrorHandler<Response>(
          window.fetch(requestInfo, requestInit)
        );
        if (responseError) {
          // TODO: エラー処理
          return;
        }
        if (!response.ok) {
          // TODO: エラー処理
          return;
        }
        const data = await response.json();
        if (!_.isArray(data)) {
          // TODO: エラー処理
          return;
        }
        const datalist: UseAutocompleteReturn<T>['datalist'] = data.map(
          function (item) {
            const ret: UseAutocompleteReturn<T>['datalist'][number] = {
              value: item[autocompleteSetting.responseValueKey] as T,
            };
            if (autocompleteSetting.responseLabelKey) {
              ret.label = item[autocompleteSetting.responseLabelKey];
            }
            return ret;
          }
        );
        setDatalist(datalist);
      };
      f();
    },
    [endpoint, document, JSON.stringify(schema), JSON.stringify(payload)]
  );

  const id = useMemo<UseAutocompleteReturn<T>['id']>(function () {
    return `autocomplete-${Date.now().toString()}`;
  }, []);

  return {
    isEnabled,
    datalist,
    id,
  };
};

export type UseDynamicEnumReturn<T> = {
  isEnabled: boolean;
  list: T[];
};
export const useDynamicEnum = function <T>(
  endpoint: Endpoint,
  document: Document,
  schema: Schema
): UseDynamicEnumReturn<T> {
  const [isEnabled, setIsEnabled] = useState<boolean>(!!schema['x-enum']);
  const [list, setList] = useState<UseDynamicEnumReturn<T>['list']>([]);

  useEffect(
    function () {
      const dynamicEnum = schema['x-enum'];
      if (!dynamicEnum) {
        setIsEnabled(false);
        return;
      }
      setIsEnabled(true);
      const getRequestResult = getRequest(document, {
        operationId: dynamicEnum.operationId,
      });
      if (getRequestResult.isFailure()) {
        // TODO: エラー処理。
        return;
      }
      const request = getRequestResult.value;
      const requestValue = cleanupRequestValue(request, {
        parameters: dynamicEnum.defaultParametersValue,
        requestBody: dynamicEnum.defaultRequestBodyValue,
      });
      const f = async function () {
        const requestPayloads = constructRequestPayloads(
          request.operation,
          requestValue
        );
        const requestInfo = constructRequestInfo(
          endpoint,
          document,
          request,
          requestPayloads
        );
        const requestInit = constructRequestInit(request, requestPayloads);
        const [response, responseError] = await promiseErrorHandler<Response>(
          window.fetch(requestInfo, requestInit)
        );
        if (responseError) {
          // TODO: エラー処理
          return;
        }
        if (!response.ok) {
          // TODO: エラー処理
          return;
        }
        const data = await response.json();
        if (!_.isArray(data)) {
          // TODO: エラー処理
          return;
        }
        setList(data as T[]);
      };
      f();
    },
    [endpoint, document, JSON.stringify(schema)]
  );

  return {
    isEnabled,
    list,
  };
};
