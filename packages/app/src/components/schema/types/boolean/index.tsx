import _ from 'lodash';
import React, { useMemo } from 'react';
import Checkbox from '$components/checkbox';
import { getRegisterOptions } from '$utils/oas/v8n';
import { Props } from '../../index';

const SchemaOfTypeBoolean: React.FC<Props> = ({
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
      <Checkbox
        render={function (
          bind
        ): React.ReactElement<JSX.IntrinsicElements['input'], 'input'> {
          return <input {...bind} {...register(name, registerOptions)} />;
        }}
      />
    </>
  );
};
export default SchemaOfTypeBoolean;
