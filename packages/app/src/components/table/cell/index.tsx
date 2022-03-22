import classnames from 'classnames';
import React, { useMemo } from 'react';
import { Props as BaseProps } from '~/components';
import { Schema } from '~/types/oas';
import CellForTypeArray from './array';
import CellForTypeBoolean from './boolean';
import CellForTypeNumberAndInteger from './numeric';
import CellForTypeObject from './object';
import CellForTypeString from './string';

export type Props = BaseProps & {
  schema: Schema;
  value: any;
};
const Cell: React.FC<Props> = ({ on, schema, value }) => {
  const content = useMemo<JSX.Element>(() => {
    switch (schema.type) {
      case 'string':
        return <CellForTypeString on={on} schema={schema} value={value} />;
      case 'number':
      case 'integer':
        return (
          <CellForTypeNumberAndInteger on={on} schema={schema} value={value} />
        );
      case 'object':
        return <CellForTypeObject on={on} schema={schema} value={value} />;
      case 'array':
        return <CellForTypeArray on={on} schema={schema} value={value} />;
      case 'boolean':
        return <CellForTypeBoolean on={on} schema={schema} value={value} />;
    }
  }, [schema, value]);

  return (
    <>
      <div className={classnames(`text-xxs text-thm-on-${on}-slight flex`)}>
        <div>[{schema.type}]</div>
        {schema.format && <div>[{schema.format}]</div>}
      </div>
      <div>{content}</div>
    </>
  );
};
export default Cell;
