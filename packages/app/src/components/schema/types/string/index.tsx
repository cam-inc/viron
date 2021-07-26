import _ from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { Validate } from 'react-hook-form';
import Select from '$components/select';
import Textinput from '$components/textinput';
import Wyswyg, { Props as WyswygProps } from '$components/wyswyg';
import { getRegisterOptions } from '$utils/oas/v8n';
import { useAutocomplete, useDynamicEnum, useNameForError } from '../../hooks';
import { Props } from '../../index';

const SchemaOfTypeString: React.FC<Props> = ({
  on,
  endpoint,
  document,
  name,
  register,
  required,
  schema,
  watch,
  isDeepActive,
  setValue,
  setError,
  clearErrors,
}) => {
  const nameForError = useNameForError({ schema, name });
  const registerOptions = useMemo<ReturnType<typeof getRegisterOptions>>(
    function () {
      if (!isDeepActive) {
        return {};
      }
      return getRegisterOptions({ required, schema });
    },
    [required, JSON.stringify(schema), isDeepActive]
  );
  // Autocomplete.
  const data = watch(name);
  const {
    isEnabled: isAutocompleteEnabled,
    datalist: autocompleteDatalist,
    id: autocompleteId,
  } = useAutocomplete<string>(endpoint, document, schema, data);

  // Dynamic Enum
  const { isEnabled: isDynamicEnumEnabled, list: dynamicEnumList } =
    useDynamicEnum<string>(endpoint, document, schema);

  // format: wyswyg
  const handleWyswygChange = useCallback<WyswygProps['onChange']>(
    function (api, block) {
      const f = async function () {
        const data = await api.saver.save();
        const _data = JSON.stringify(data);
        setValue(name, _data);

        if (!isDeepActive) {
          clearErrors(nameForError);
          return;
        }
        const errorMessages: ReturnType<Validate<string>>[] = [];
        _.forEach(
          registerOptions.validate as Record<string, Validate<string>>,
          function (v) {
            const result = v(_data);
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
      };
      f();
    },
    [
      required,
      isDeepActive,
      setValue,
      setError,
      clearErrors,
      nameForError,
      registerOptions,
    ]
  );

  if (isDynamicEnumEnabled) {
    return (
      <Select<string>
        list={dynamicEnumList}
        Select={function ({ className, children }) {
          return (
            <select className={className} {...register(name, registerOptions)}>
              {children}
            </select>
          );
        }}
        Option={function ({ className, data }) {
          return (
            <option className={className} value={data}>
              {data}
            </option>
          );
        }}
        OptionBlank={function ({ className }) {
          return (
            <option className={className} value={undefined}>
              ---
            </option>
          );
        }}
      />
    );
  }

  if (schema.enum) {
    return (
      <Select<string>
        list={schema.enum}
        Select={function ({ className, children }) {
          return (
            <select className={className} {...register(name, registerOptions)}>
              {children}
            </select>
          );
        }}
        Option={function ({ className, data }) {
          return (
            <option className={className} value={data}>
              {data}
            </option>
          );
        }}
        OptionBlank={function ({ className }) {
          return (
            <option className={className} value={undefined}>
              ---
            </option>
          );
        }}
      />
    );
  }

  if (schema.format === 'wyswyg') {
    return <Wyswyg on={on} onChange={handleWyswygChange} />;
  }

  return (
    <>
      <Textinput
        type={(function () {
          if (schema.format === 'email') {
            return 'email';
          }
          return 'text';
        })()}
        autocompleteId={autocompleteId}
        render={function (bind) {
          return <input {...bind} {...register(name, registerOptions)} />;
        }}
      />
      {isAutocompleteEnabled && (
        <datalist id={autocompleteId}>
          {autocompleteDatalist.map(function (item, idx) {
            return (
              <React.Fragment key={idx}>
                <option value={item.value}>{item.label || item.value}</option>
              </React.Fragment>
            );
          })}
        </datalist>
      )}
    </>
  );
};
export default SchemaOfTypeString;
