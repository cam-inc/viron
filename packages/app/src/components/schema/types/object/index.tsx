import _ from 'lodash';
import React from 'react';
import _Schema from '$components/schema';
import { Props } from '../../index';

const SchemaOfTypeObject: React.FC<Props> = ({
  name,
  schema,
  register,
  unregister,
  control,
  formState,
  getValues,
  setValue,
  watch,
  setError,
  clearErrors,
  isDeepActive,
  activeRef,
}) => {
  return (
    <>
      <ul className="ml-2">
        {_.map(schema.properties, function (_schema, _name) {
          return (
            <li key={_name}>
              <_Schema
                name={`${name}.${_name}`}
                schema={_schema}
                formState={formState}
                register={register}
                unregister={unregister}
                control={control}
                getValues={getValues}
                setValue={setValue}
                watch={watch}
                setError={setError}
                clearErrors={clearErrors}
                required={(schema.required || []).includes(_name)}
                isDeepActive={isDeepActive}
                activeRef={activeRef}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
};
export default SchemaOfTypeObject;
