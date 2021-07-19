import _ from 'lodash';
import React, { useEffect } from 'react';
import { useFieldArray, Validate } from 'react-hook-form';
import _Schema from '$components/schema';
import { Schema } from '$types/oas';
import { getDefaultValue } from '$utils/oas';
import { getRegisterOptions } from '$utils/oas/v8n';
import { useNameForError } from '../../hooks/index';
import { Props } from '../../index';

const SchemaOfTypeArray: React.FC<Props> = ({
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

      const errorMessages: ReturnType<Validate<any[]>>[] = [];
      const registerOptions = getRegisterOptions({ required, schema });
      if (!required && _.isUndefined(data)) {
        return;
      }
      _.forEach(
        registerOptions.validate as Record<string, Validate<any[]>>,
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

  const { fields, append, prepend, insert, remove } = useFieldArray({
    name,
    control,
  });
  const handleAppendClick = function () {
    append(getDefaultValue(schema.items as Schema));
  };
  const handlePrependClick = function () {
    prepend(getDefaultValue(schema.items as Schema));
  };
  const handleItemRemoveClick = function (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) {
    const index = Number(e.currentTarget.dataset.index);
    remove(index);
  };
  const handleItemInsertClick = function (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) {
    const index = Number(e.currentTarget.dataset.index);
    insert(index, getDefaultValue(schema.items as Schema));
  };

  return (
    <>
      <p onClick={handlePrependClick}>+prepend</p>
      <ul className="ml-2">
        {fields.map(function (field, index) {
          return (
            <li key={field.id}>
              <div onClick={handleItemRemoveClick} data-index={index}>
                -remove
              </div>
              <_Schema
                on={on}
                name={`${name}.${index}`}
                schema={schema.items as Schema}
                formState={formState}
                register={register}
                unregister={unregister}
                control={control}
                getValues={getValues}
                setValue={setValue}
                watch={watch}
                setError={setError}
                clearErrors={clearErrors}
                // TODO: 本当に常にtrueでOKなのか？
                required={true}
                isDeepActive={isDeepActive}
                activeRef={activeRef}
              />
              <div onClick={handleItemInsertClick} data-index={index + 1}>
                +insert
              </div>
            </li>
          );
        })}
      </ul>
      <p onClick={handleAppendClick}>+append</p>
    </>
  );
};
export default SchemaOfTypeArray;
