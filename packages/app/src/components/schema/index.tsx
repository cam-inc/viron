import React, { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Props as BaseProps } from '@/components';
import { Endpoint } from '@/types';
import { Document, Schema } from '@/types/oas';
import { useActive, UseEliminateReturn } from './hooks/index';
import Container, { Props as ContainerProps } from './parts/container';
import OneOf from './parts/oneOf';
import SchemaOfTypeArray from './types/array';
import SchemaOfTypeBoolean from './types/boolean';
import SchemaOfTypeInteger from './types/integer';
import SchemaOfTypeNumber from './types/number';
import SchemaOfTypeObject from './types/object';
import SchemaOfTypeString from './types/string';

export type Props = BaseProps & {
  endpoint: Endpoint;
  document: Document;
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
const _Schema: React.FC<Props & Pick<ContainerProps, 'renderHeadItem'>> = ({
  on,
  renderHeadItem,
  endpoint,
  document,
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
  const Component = useMemo<React.FC<Props>>(() => {
    if (schema.oneOf) {
      return OneOf;
    }
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
  }, [schema]);

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
      renderHeadItem={renderHeadItem}
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
