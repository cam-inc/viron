import _ from 'lodash';
import React, { useMemo } from 'react';
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
      <Textinput
        render={function (
          className
        ): React.ReactElement<JSX.IntrinsicElements['input'], 'input'> {
          return (
            <input className={className} {...register(name, registerOptions)} />
          );
        }}
      />
    </>
  );
};
export default SchemaOfTypeString;
