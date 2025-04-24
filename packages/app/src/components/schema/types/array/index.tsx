import _ from 'lodash';
import { CirclePlusIcon, CircleMinusIcon } from 'lucide-react';
import React, { useCallback, useEffect } from 'react';
import { Validate } from 'react-hook-form';
import _Schema from '~/components/schema';
import { Button } from '~/components/ui/button';
import { useTranslation } from '~/hooks/i18n';
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
  const { t } = useTranslation();

  useEffect(() => {
    if (!isDeepActive) {
      clearErrors(nameForError);
      return;
    }

    const errorMessages: ReturnType<Validate<any[], any>>[] = [];
    const registerOptions = getRegisterOptions({ required, schema });
    _.forEach(
      registerOptions.validate as Record<string, Validate<any[], any>>,
      (v) => {
        const result = v(data || [], undefined);
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

  const handleAppendClick = useCallback(() => {
    const defaultValue = getDefaultValue(schema.items as Schema);
    setValue(name, [...(data || []), defaultValue]);
  }, [setValue, name, JSON.stringify(data)]);

  const handlePrependClick = useCallback(() => {
    const defaultValue = getDefaultValue(schema.items as Schema);
    setValue(name, [defaultValue, ...(data || [])]);
  }, [setValue, name, JSON.stringify(data)]);

  const handleRemoveClick = useCallback(
    (from: number) => {
      const newData = [...(data || [])];
      newData.splice(from, 1);
      setValue(name, newData);
    },
    [setValue, name, JSON.stringify(data)]
  );

  const handleInsertClick = useCallback(
    (to: number) => {
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
        <Button variant="ghost" onClick={handlePrependClick}>
          <CirclePlusIcon />
          {t('prependButtonLabel')}
        </Button>
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
              <Button variant="ghost" onClick={() => handleRemoveClick(index)}>
                <CircleMinusIcon />
                {t('removeButtonLabel')}
              </Button>
            )}
          />
          {index < (data || []).length - 1 && (
            <Button
              variant="ghost"
              onClick={() => handleInsertClick(index + 1)}
            >
              <CirclePlusIcon />
              {t('insertButtonLabel')}
            </Button>
          )}
        </React.Fragment>
      ))}
      <Button variant="ghost" onClick={handleAppendClick}>
        <CirclePlusIcon />
        {t('appendButtonLabel')}
      </Button>
    </div>
  );
};
export default SchemaOfTypeArray;
