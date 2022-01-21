import _ from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import Select from '~/components/select';
import { Schema } from '~/types/oas';
import { Props } from '../../index';
import SchemaOfTypeArray from '../../types/array';
import SchemaOfTypeBoolean from '../../types/boolean';
import SchemaOfTypeInteger from '../../types/integer';
import SchemaOfTypeNumber from '../../types/number';
import SchemaOfTypeString from '../../types/string';
import SchemaOfTypeObject from '../../types/object';

type Data = Schema & {
  id: string;
};
const OneOf: React.FC<Props> = (props) => {
  const { on, name, setValue, schema } = props;

  const [selectedSchemaId, setSelectedSchemaId] = useState<Data['id']>('');

  const list = useMemo<Data[]>(
    () =>
      (schema.oneOf as Schema[]).map((schema, index) => ({
        ...schema,
        title: schema.title || index.toString(),
        id: index.toString(),
      })),
    [schema]
  );

  const handleSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const id = e.currentTarget.value;
      setValue(name, undefined);
      setSelectedSchemaId(id);
    },
    [name, setValue]
  );

  const component = useMemo<JSX.Element | null>(() => {
    const schema = list.find((item) => item.id === selectedSchemaId);
    if (!schema) {
      return null;
    }
    const _props = {
      ...props,
      schema,
    };
    switch (schema.type) {
      case 'string':
        return <SchemaOfTypeString {..._props} />;
      case 'number':
        return <SchemaOfTypeNumber {..._props} />;
      case 'integer':
        return <SchemaOfTypeInteger {..._props} />;
      case 'object':
        return <SchemaOfTypeObject {..._props} />;
      case 'array':
        return <SchemaOfTypeArray {..._props} />;
      case 'boolean':
        return <SchemaOfTypeBoolean {..._props} />;
    }
  }, [props, selectedSchemaId, list]);

  return (
    <div>
      <Select<Data>
        on={on}
        list={list}
        Select={({ className, children }) => (
          <select
            className={className}
            value={selectedSchemaId}
            onChange={handleSelectChange}
          >
            {children}
          </select>
        )}
        Option={({ className, data }) => (
          <option className={className} value={data.id}>
            {data.title}
          </option>
        )}
        OptionBlank={({ className }) => (
          <option className={className} value="">
            -
          </option>
        )}
      />
      {component}
    </div>
  );
};
export default OneOf;
