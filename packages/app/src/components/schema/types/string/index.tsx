import _ from 'lodash';
import React, { useMemo } from 'react';
import { RegisterOptions, ValidateResult } from 'react-hook-form';
import Textinput from '$components/textinput';
import { Props } from '../../index';

const SchemaOfTypeString: React.FC<Props> = ({
  name,
  register,
  required,
  isDeepActive,
}) => {
  const registerOptions = useMemo<RegisterOptions>(
    function () {
      const options: RegisterOptions = {};
      if (!isDeepActive) {
        return options;
      }
      options.validate = {};
      if (required) {
        options.validate.required = function (data): ValidateResult {
          if (_.isUndefined(data)) {
            return 'Required';
          }
          return true;
        };
      }
      // TODO:
      options.validate.testes = function (data): ValidateResult {
        if (!data) {
          return 'TesTes';
        }
        return true;
      };
      return options;
    },
    [isDeepActive, required]
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
