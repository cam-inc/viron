import React, { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { On } from '$constants/index';
import { Endpoint } from '$types/index';
import { Document, Schema } from '$types/oas';
import { useActive, UseEliminateReturn } from './hooks/index';
import Container from './parts/container';
import SchemaOfTypeArray from './types/array';
import SchemaOfTypeBoolean from './types/boolean';
import SchemaOfTypeInteger from './types/integer';
import SchemaOfTypeNumber from './types/number';
import SchemaOfTypeString from './types/string';
import SchemaOfTypeObject from './types/object';

export type Props = {
  endpoint: Endpoint;
  document: Document;
  on: On;
  name: string;
  schema: Schema;
  register: UseFormReturn['register'];
  unregister: UseFormReturn['unregister'];
  control: UseFormReturn['control'];
  watch: UseFormReturn['watch'];
  formState: UseFormReturn['formState'];
  getValues: UseFormReturn['getValues'];
  setValue: UseFormReturn['setValue'];
  setError: UseFormReturn['setError'];
  clearErrors: UseFormReturn['clearErrors'];
  required: boolean;
  isDeepActive: boolean;
  activeRef: UseEliminateReturn['ref'];
};
const _Schema: React.FC<Props> = ({
  endpoint,
  document,
  on,
  name,
  schema,
  register,
  unregister,
  control,
  watch,
  formState,
  getValues,
  setValue,
  setError,
  clearErrors,
  required,
  isDeepActive,
  activeRef,
}) => {
  const Component = useMemo<React.FC<Props>>(
    function () {
      switch (schema.type) {
        case 'string':
          return SchemaOfTypeString;
        case 'number':
          return SchemaOfTypeNumber;
        case 'integer':
          return SchemaOfTypeInteger;
        case 'object':
          return SchemaOfTypeObject;
        case 'array':
          return SchemaOfTypeArray;
        case 'boolean':
          return SchemaOfTypeBoolean;
      }
    },
    [schema]
  );

  const { isActive, isActiveSwitchable, activate, inactivate, switchActive } =
    useActive({
      name,
      schema,
      required,
      map: activeRef,
      getValues,
    });

  return (
    <Container
      on={on}
      name={name}
      schema={schema}
      formState={formState}
      isActive={isActive}
      isActiveSwitchable={isActiveSwitchable}
      activate={activate}
      inactivate={inactivate}
      switchActive={switchActive}
      required={required}
    >
      <Component
        endpoint={endpoint}
        document={document}
        on={on}
        name={name}
        schema={schema}
        register={register}
        unregister={unregister}
        control={control}
        watch={watch}
        formState={formState}
        getValues={getValues}
        setValue={setValue}
        setError={setError}
        clearErrors={clearErrors}
        required={required}
        isDeepActive={isDeepActive && isActive}
        activeRef={activeRef}
      />
    </Container>
  );
};
export default _Schema;
