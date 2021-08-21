import _ from 'lodash';
import React, { useMemo } from 'react';
import Select from '$components/select';
import { getRegisterOptions } from '$utils/oas/v8n';
import { Props } from '../../index';

const SchemaOfTypeBoolean: React.FC<Props> = ({
  on,
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

  return (
    <Select<string>
      on={on}
      list={['true', 'false']}
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
};
export default SchemaOfTypeBoolean;
