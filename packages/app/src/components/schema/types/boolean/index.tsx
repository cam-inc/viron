import React, { useMemo } from 'react';
import { Select, SelectItem } from '~/components/ui/select';
import { getRegisterOptions } from '~/utils/oas/v8n';
import { Props } from '../../index';

const SchemaOfTypeBoolean: React.FC<Props> = ({
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

  return (
    <Select {...register(name, registerOptions)}>
      <SelectItem value={undefined}>---</SelectItem>
      <SelectItem value="true">true</SelectItem>
      <SelectItem value="false">false</SelectItem>
    </Select>
  );
};
export default SchemaOfTypeBoolean;
