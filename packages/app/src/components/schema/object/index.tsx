import classnames from 'classnames';
import _ from 'lodash';
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import _Schema from '$components/schema';
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
const SchemaOfTypeObject: React.FC<Props> = ({
  name,
  schema,
  register,
  unregister,
  control,
  formState,
  required,
}) => {
  // Require parameters in OAS usually mean to have a key-value pair exists.
  const [isToInput, setIsToInput] = useState<boolean>(required);
  const handleNameClick = function () {
    setIsToInput(!isToInput);
  };

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
        <ul>
          {_.map(schema.properties, function (_schema, _name) {
            return (
              <li key={_name}>
                <_Schema
                  name={`${name}.${_name}`}
                  schema={_schema as Schema}
                  formState={formState}
                  register={register}
                  unregister={unregister}
                  control={control}
                  required={(schema.required || []).includes(_name)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
export default SchemaOfTypeObject;
