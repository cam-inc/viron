import _ from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { Validate } from 'react-hook-form';
import Base64Reader, {
  Props as Base64ReaderProps,
} from '~/components/base64Reader';
import FileReader, { Props as FileReaderProps } from '~/components/fileReader';
import { Input } from '~/components/ui/input';
import { Select, SelectItem } from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import Wyswyg, { Props as WyswygProps } from '~/components/wyswyg';
import { getRegisterOptions } from '~/utils/oas/v8n';
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
        const errorMessages: ReturnType<Validate<string, any>>[] = [];
        _.forEach(
          registerOptions.validate as Record<string, Validate<string, any>>,
          function (v) {
            const result = v(_data, undefined);
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

  // File Uploads
  const handleFileReaderChange = useCallback<FileReaderProps['onChange']>(
    (file) => {
      setValue(name, file);
    },
    [setValue]
  );
  const handleBase64ReaderChange = useCallback<Base64ReaderProps['onChange']>(
    (base64) => {
      setValue(name, base64);
    },
    [setValue]
  );

  if (schema.format === 'binary') {
    return (
      <div>
        <FileReader onChange={handleFileReaderChange} />
      </div>
    );
  }

  if (schema.format === 'base64') {
    return (
      <div>
        <Base64Reader onChange={handleBase64ReaderChange} />
      </div>
    );
  }

  if (isDynamicEnumEnabled) {
    return (
      <Select {...register(name, registerOptions)}>
        <SelectItem value={undefined}>---</SelectItem>
        {dynamicEnumList.map((item, idx) => (
          <SelectItem key={idx} value={item}>
            {item}
          </SelectItem>
        ))}
      </Select>
    );
  }

  if (schema.enum) {
    return (
      <Select {...register(name, registerOptions)}>
        <SelectItem value={undefined}>---</SelectItem>
        {schema.enum.map((item, idx) => (
          <SelectItem key={idx} value={item}>
            {item}
          </SelectItem>
        ))}
      </Select>
    );
  }

  if (schema.format === 'wyswyg') {
    return <Wyswyg on={on} onChange={handleWyswygChange} />;
  }

  if (schema.format === 'multiline') {
    return <Textarea {...register(name, registerOptions)} />;
  }

  return (
    <>
      <Input
        type={(function () {
          if (schema.format === 'email') {
            return 'email';
          }
          if (schema.format === 'password') {
            return 'password';
          }
          return 'text';
        })()}
        list={autocompleteId}
        {...register(name, registerOptions)}
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
