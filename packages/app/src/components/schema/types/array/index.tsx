import _ from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { Validate } from 'react-hook-form';
import { SIZE as BUTTON_SIZE } from '~/components/button';
import TextOnButton, {
  Props as TextOnButtonProps,
} from '~/components/button/text/on';
import MinusIcon from '~/components/icon/minusCircle/outline';
import PlusIcon from '~/components/icon/plusCircle/outline';
import _Schema from '~/components/schema';
import { Schema } from '~/types/oas';
import { getDefaultValue } from '~/utils/oas';
import { getRegisterOptions } from '~/utils/oas/v8n';
import { useNameForError } from '../../hooks';
import { Props } from '../../index';

// Functions like `append` from useFieldArray accepts argument of type object only.
// Use `setValue` to append data of type other than object.
const SchemaOfTypeArray: React.FC<Props> = ({
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
  const data: any[] | undefined = getValues(name);
  const nameForError = useNameForError({ schema, name });
  useEffect(() => {
    if (!isDeepActive) {
      clearErrors(nameForError);
      return;
    }

    const errorMessages: ReturnType<Validate<any[]>>[] = [];
    const registerOptions = getRegisterOptions({ required, schema });
    _.forEach(
      registerOptions.validate as Record<string, Validate<any[]>>,
      (v) => {
        const result = v(data || []);
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
  }, [
    nameForError,
    JSON.stringify(data),
    isDeepActive,
    clearErrors,
    required,
    JSON.stringify(schema),
    setError,
  ]);

  const handleAppendClick = useCallback<TextOnButtonProps['onClick']>(() => {
    const defaultValue = getDefaultValue(schema.items as Schema);
    setValue(name, [...(data || []), defaultValue]);
  }, [setValue, name, JSON.stringify(data)]);

  const handlePrependClick = useCallback<TextOnButtonProps['onClick']>(() => {
    const defaultValue = getDefaultValue(schema.items as Schema);
    setValue(name, [defaultValue, ...(data || [])]);
  }, [setValue, name, JSON.stringify(data)]);

  const handleRemoveClick = useCallback<TextOnButtonProps<number>['onClick']>(
    (from) => {
      const newData = [...(data || [])];
      newData.splice(from, 1);
      setValue(name, newData);
    },
    [setValue, name, JSON.stringify(data)]
  );

  const handleInsertClick = useCallback<TextOnButtonProps<number>['onClick']>(
    (to) => {
      const defaultValue = getDefaultValue(schema.items as Schema);
      const newData = [...(data || [])];
      newData.splice(to, 0, defaultValue);
      setValue(name, newData);
    },
    [setValue, name, JSON.stringify(data)]
  );

  return (
    <div className="space-y-2">
      {!!(data || []).length && (
        <TextOnButton
          on={on}
          size={BUTTON_SIZE.XS}
          Icon={PlusIcon}
          label="Prepend"
          onClick={handlePrependClick}
        />
      )}
      {(data || []).map((_, index) => (
        <React.Fragment key={index}>
          <_Schema
            endpoint={endpoint}
            document={document}
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
            renderHeadItem={() => (
              <TextOnButton<number>
                className="block"
                on={on}
                size={BUTTON_SIZE.XS}
                data={index}
                Icon={MinusIcon}
                label="Remove"
                onClick={handleRemoveClick}
              />
            )}
          />
          {index < (data || []).length - 1 && (
            <TextOnButton<number>
              className="block"
              on={on}
              size={BUTTON_SIZE.XS}
              data={index + 1}
              Icon={PlusIcon}
              label="Insert"
              onClick={handleInsertClick}
            />
          )}
        </React.Fragment>
      ))}
      <TextOnButton
        className="block"
        on={on}
        size={BUTTON_SIZE.XS}
        Icon={PlusIcon}
        label="Append"
        onClick={handleAppendClick}
      />
    </div>
  );
};
export default SchemaOfTypeArray;
