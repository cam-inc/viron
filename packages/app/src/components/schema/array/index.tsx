import classnames from 'classnames';
import _ from 'lodash';
import React, { useState } from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
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
const SchemaOfTypeArray: React.FC<Props> = ({
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

  const { fields, append } = useFieldArray({
    name,
    control,
  });
  const handleAppendClick = function () {
    append(schema.default);
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
      <p onClick={handleAppendClick}>+append</p>
      {isToInput && (
        <ul>
          {_.map(fields, function (field, index) {
            return (
              <li key={field.id}>
                <_Schema
                  name={`${name}.${index}`}
                  schema={schema.items as Schema}
                  formState={formState}
                  register={register}
                  unregister={unregister}
                  control={control}
                  // TODO: 本当に常にfalseでOKなのか？
                  required={false}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
export default SchemaOfTypeArray;
