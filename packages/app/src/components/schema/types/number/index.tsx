import _ from 'lodash';
import React, { useMemo } from 'react';
import Numberinput from '$components/numberinput';
import { getRegisterOptions } from '$utils/oas/v8n';
import { Props } from '../../index';

const SchemaOfTypeNumber: React.FC<Props> = ({
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
      <Numberinput
        render={function (
          bind
        ): React.ReactElement<JSX.IntrinsicElements['input'], 'input'> {
          return <input {...bind} {...register(name, registerOptions)} />;
        }}
      />
    </>
  );
};
export default SchemaOfTypeNumber;
