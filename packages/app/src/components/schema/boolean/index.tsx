import classnames from 'classnames';
import _ from 'lodash';
import React, { useMemo, useState } from 'react';
import {
  RegisterOptions,
  UseFormReturn,
  ValidateResult,
} from 'react-hook-form';
import FieldError from '$components/fieldError';
import Checkbox from '$components/checkbox';
import { Schema } from '$types/oas';

type Props = {
  name: string;
  schema: Schema;
  register: UseFormReturn['register'];
  unregister: UseFormReturn['unregister'];
  control: UseFormReturn['control'];
  formState: UseFormReturn['formState'];
  required: boolean;
};
const SchemaOfTypeBoolean: React.FC<Props> = ({
  name,
  register,
  unregister,
  formState,
  required,
}) => {
  // Require parameters in OAS usually mean to have a key-value pair exists.
  const [isToInput, setIsToInput] = useState<boolean>(required);
  const handleNameClick = function () {
    setIsToInput(!isToInput);
    if (isToInput) {
      unregister(name);
    }
  };

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
    <div
      className={classnames({
        'opacity-25': !isToInput,
      })}
    >
      <p onClick={handleNameClick}>
        {required && <span>[必須]</span>}name: {name}
      </p>
      {isToInput && (
        <>
          <FieldError name={name} errors={formState.errors} />
          <Checkbox
            render={function (
              bind
            ): React.ReactElement<JSX.IntrinsicElements['input'], 'input'> {
              return <input {...bind} {...register(name, registerOptions)} />;
            }}
          />
        </>
      )}
    </div>
  );
};
export default SchemaOfTypeBoolean;
