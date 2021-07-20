import _ from 'lodash';
import React, { useMemo } from 'react';
import Select from '$components/select';
import Textinput from '$components/textinput';
import { getRegisterOptions } from '$utils/oas/v8n';
import { Props } from '../../index';

const SchemaOfTypeString: React.FC<Props> = ({
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
    <>
      {schema.enum ? (
        <Select<string>
          list={schema.enum}
          Select={function ({ className, children }) {
            return (
              <select
                className={className}
                {...register(name, registerOptions)}
              >
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
      ) : (
        <Textinput
          render={function (className) {
            return (
              <input
                className={className}
                {...register(name, registerOptions)}
              />
            );
          }}
        />
      )}
    </>
  );
};
export default SchemaOfTypeString;
