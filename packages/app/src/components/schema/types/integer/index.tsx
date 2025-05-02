import React, { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';
import { getRegisterOptions } from '@/utils/oas/v8n';
import { useDynamicEnum } from '../../hooks';
import { Props } from '../../index';

const SchemaOfTypeInteger: React.FC<Props> = ({
  endpoint,
  document,
  name,
  register,
  required,
  schema,
  isDeepActive,
}) => {
  const registerOptions = useMemo<ReturnType<typeof getRegisterOptions>>(() => {
    if (!isDeepActive) {
      return {};
    }
    return getRegisterOptions({ required, schema });
  }, [required, schema, isDeepActive]);

  // Dynamic Enum
  const { isEnabled: isDynamicEnumEnabled, list: dynamicEnumList } =
    useDynamicEnum<number>(endpoint, document, schema);

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

  return <Input type="number" step="1" {...register(name, registerOptions)} />;
};
export default SchemaOfTypeInteger;
