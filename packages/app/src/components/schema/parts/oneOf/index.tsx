import React, { useCallback, useMemo, useState } from 'react';
import { Select, SelectItem } from '@/components/ui/select';
import { Schema } from '@/types/oas';
import { Props } from '../../index';
import SchemaOfTypeArray from '../../types/array';
import SchemaOfTypeBoolean from '../../types/boolean';
import SchemaOfTypeInteger from '../../types/integer';
import SchemaOfTypeNumber from '../../types/number';
import SchemaOfTypeObject from '../../types/object';
import SchemaOfTypeString from '../../types/string';

type Data = Schema & {
  id: string;
};
const OneOf: React.FC<Props> = (props) => {
  const { name, setValue, schema } = props;

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
      <Select value={selectedSchemaId} onChange={handleSelectChange}>
        <SelectItem value="">-</SelectItem>
        {list.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.title}
          </SelectItem>
        ))}
      </Select>
      {component}
    </div>
  );
};
export default OneOf;
