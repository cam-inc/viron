import _ from 'lodash';
import React, { useEffect } from 'react';
import { Validate } from 'react-hook-form';
import _Schema from '$components/schema';
import { getRegisterOptions } from '$utils/oas/v8n';
import { useNameForError } from '../../hooks/index';
import { Props } from '../../index';

const SchemaOfTypeObject: React.FC<Props> = ({
  endpoint,
  document,
  on,
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
  required,
  isDeepActive,
  activeRef,
}) => {
  const data = watch(name);
  const nameForError = useNameForError({ schema, name });
  useEffect(
    function () {
      if (!isDeepActive) {
        clearErrors(nameForError);
        return;
      }
      const errorMessages: ReturnType<Validate<Record<string, any>>>[] = [];
      const registerOptions = getRegisterOptions({ required, schema });
      if (!required && _.isUndefined(data)) {
        return;
      }
      _.forEach(
        registerOptions.validate as Record<
          string,
          Validate<Record<string, any>>
        >,
        function (v) {
          const result = v(data);
          if (result !== true) {
            errorMessages.push(result);
          }
        }
      );
      if (errorMessages.length) {
        setError(nameForError, {
          type: 'manual',
          message: errorMessages[0] as string,
        });
      } else {
        clearErrors(nameForError);
      }
    },
    [
      nameForError,
      JSON.stringify(data),
      isDeepActive,
      clearErrors,
      required,
      JSON.stringify(schema),
      setError,
    ]
  );

  return (
    <>
      <ul className="ml-2">
        {_.map(schema.properties, function (_schema, _name) {
          return (
            <li key={_name}>
              <_Schema
                endpoint={endpoint}
                document={document}
                on={on}
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
