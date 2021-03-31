import React, { useMemo } from 'react';
import { FieldError as FieldErrorType } from 'react-hook-form';
import FieldError from '$components/fieldError';
import Textinput from '$components/textinput';
import { Schema } from '$types/oas';

type Props = {
  name: string;
  schema: Schema;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  error?: FieldErrorType;
};
const _Schema: React.FC<Props> = ({ name, schema, register, error }) => {
  const elm = useMemo<JSX.Element | null>(
    function () {
      switch (schema.type) {
        case 'string':
          return (
            <div>
              <Textinput
                render={function (
                  className
                ): React.ReactElement<JSX.IntrinsicElements['input'], 'input'> {
                  return (
                    <input name={name} className={className} ref={register} />
                  );
                }}
              />
            </div>
          );
        case 'number':
        case 'integer':
        case 'object':
        case 'array':
        case 'boolean':
        default:
          return null;
      }
    },
    [schema, name, register]
  );

  return (
    <div>
      <p>name: {name}</p>
      {!!error && <FieldError error={error} />}
      <div>{elm}</div>
    </div>
  );
};
export default _Schema;
