import _ from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Schema } from '$types/oas';

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
