import _ from 'lodash';
import React, { useMemo } from 'react';
import { RegisterOptions, ValidateResult } from 'react-hook-form';
import Numberinput from '$components/numberinput';
import { Props } from '../../index';

const SchemaOfTypeInteger: React.FC<Props> = ({ name, register, required }) => {
  const registerOptions = useMemo<RegisterOptions>(
    function () {
      const options: RegisterOptions = {};
      options.validate = {};
      if (required) {
        options.validate.required = function (data): ValidateResult {
          if (_.isUndefined(data)) {
            return 'Required';
          }
          return true;
        };
      }
      return options;
    },
    [required]
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
export default SchemaOfTypeInteger;
