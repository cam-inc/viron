import _ from 'lodash';
import React, { useMemo } from 'react';
import Numberinput from '$components/numberinput';
import Select from '$components/select';
import { getRegisterOptions } from '$utils/oas/v8n';
import { useDynamicEnum } from '../../hooks';
import { Props } from '../../index';

const SchemaOfTypeNumber: React.FC<Props> = ({
  endpoint,
  document,
  name,
  register,
  required,
  schema,
  isDeepActive,
}) => {
  const registerOptions = useMemo<ReturnType<typeof getRegisterOptions>>(
    function () {
      if (!isDeepActive) {
        return {};
      }
      return getRegisterOptions({ required, schema });
    },
    [required, schema, isDeepActive]
  );

  // Dynamic Enum
  const { isEnabled: isDynamicEnumEnabled, list: dynamicEnumList } =
    useDynamicEnum<number>(endpoint, document, schema);

  if (isDynamicEnumEnabled) {
    return (
      <Select<number>
        list={dynamicEnumList}
        Select={function ({ className, children }) {
          return (
            <select className={className} {...register(name, registerOptions)}>
              {children}
            </select>
          );
        }}
        Option={function ({ className, data }) {
          return (
            <option className={className} value={data}>
              {data}
            </option>
          );
        }}
        OptionBlank={function ({ className }) {
          return (
            <option className={className} value={undefined}>
              ---
            </option>
          );
        }}
      />
    );
  }

  if (schema.enum) {
    return (
      <Select<number>
        list={schema.enum}
        Select={function ({ className, children }) {
          return (
            <select className={className} {...register(name, registerOptions)}>
              {children}
            </select>
          );
        }}
        Option={function ({ className, data }) {
          return (
            <option className={className} value={data}>
              {data}
            </option>
          );
        }}
        OptionBlank={function ({ className }) {
          return (
            <option className={className} value={undefined}>
              ---
            </option>
          );
        }}
      />
    );
  }

  return (
    <>
      <Numberinput
        isFloat
        render={function (bind) {
          return <input {...bind} {...register(name, registerOptions)} />;
        }}
      />
    </>
  );
};
export default SchemaOfTypeNumber;
