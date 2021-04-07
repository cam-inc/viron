import React, { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Schema } from '$types/oas';
import SchemaOfTypeArray from './array';
import SchemaOfTypeBoolean from './boolean';
import SchemaOfTypeInteger from './integer';
import SchemaOfTypeNumber from './number';
import SchemaOfTypeString from './string';
import SchemaOfTypeObject from './object';

type Props = {
  name: string;
  schema: Schema;
  register: UseFormReturn['register'];
  unregister: UseFormReturn['unregister'];
  control: UseFormReturn['control'];
  formState: UseFormReturn['formState'];
  required?: boolean;
};
const _Schema: React.FC<Props> = ({
  name,
  schema,
  register,
  unregister,
  control,
  formState,
  required = false,
}) => {
  const elm = useMemo<JSX.Element | null>(
    function () {
      switch (schema.type) {
        case 'string':
          return (
            <SchemaOfTypeString
              name={name}
              schema={schema}
              register={register}
              unregister={unregister}
              control={control}
              formState={formState}
              required={required}
            />
          );
        case 'number':
          return (
            <SchemaOfTypeNumber
              name={name}
              schema={schema}
              register={register}
              unregister={unregister}
              control={control}
              formState={formState}
              required={required}
            />
          );
        case 'integer':
          return (
            <SchemaOfTypeInteger
              name={name}
              schema={schema}
              register={register}
              unregister={unregister}
              control={control}
              formState={formState}
              required={required}
            />
          );
        case 'object':
          return (
            <SchemaOfTypeObject
              name={name}
              schema={schema}
              register={register}
              unregister={unregister}
              control={control}
              formState={formState}
              required={required}
            />
          );
        case 'array':
          return (
            <SchemaOfTypeArray
              name={name}
              schema={schema}
              register={register}
              unregister={unregister}
              control={control}
              formState={formState}
              required={required}
            />
          );
        case 'boolean':
          return (
            <SchemaOfTypeBoolean
              name={name}
              schema={schema}
              register={register}
              unregister={unregister}
              control={control}
              formState={formState}
              required={required}
            />
          );
        default:
          return null;
      }
    },
    [schema, name, register, unregister, control, formState, required]
  );

  return (
    <div>
      <div>{elm}</div>
    </div>
  );
};
export default _Schema;
