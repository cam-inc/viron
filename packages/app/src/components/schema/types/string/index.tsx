import _ from 'lodash';
import React, { useMemo } from 'react';
import Select from '$components/select';
import Textinput from '$components/textinput';
import { getRegisterOptions } from '$utils/oas/v8n';
import { useAutocomplete, useDynamicEnum } from '../../hooks';
import { Props } from '../../index';

const SchemaOfTypeString: React.FC<Props> = ({
  endpoint,
  document,
  name,
  register,
  required,
  schema,
  watch,
  isDeepActive,
}) => {
  const registerOptions = useMemo<ReturnType<typeof getRegisterOptions>>(
    function () {
      if (!isDeepActive) {
        return {};
      }
      return getRegisterOptions({ required, schema });
    },
    [required, schema, isDeepActive]
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

  return (
    <>
      <Textinput
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
