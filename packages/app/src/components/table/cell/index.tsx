import _ from 'lodash';
import React, { useMemo } from 'react';
import { Props as BaseProps } from '~/components';
import { Schema } from '~/types/oas';
import CellForTypeArray from './array';
import CellForTypeBoolean from './boolean';
import CellForTypeNullish from './nullish';
import CellForTypeNumberAndInteger from './numeric';
import CellForTypeObject from './object';
import CellForTypeString from './string';

export type Props = BaseProps & {
  schema: Schema;
  value: any;
};
const Cell: React.FC<Props> = ({ on, schema, value }) => {
  const content = useMemo<JSX.Element>(() => {
    if (_.isNil(value)) {
      return <CellForTypeNullish on={on} schema={schema} value={value} />;
    }
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
  }, [on, schema, value]);

  return <div className="text-xs">{content}</div>;
};
export default Cell;
