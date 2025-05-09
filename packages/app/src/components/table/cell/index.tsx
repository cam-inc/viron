import _ from 'lodash';
import React, { useMemo } from 'react';
import { Props as BaseProps } from '@/components';
import { Schema } from '@/types/oas';
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
const Cell: React.FC<Props> = ({ schema, value }) => {
  const content = useMemo<JSX.Element>(() => {
    if (_.isNil(value)) {
      return <CellForTypeNullish schema={schema} value={value} />;
    }
    switch (schema.type) {
      case 'string':
        return <CellForTypeString schema={schema} value={value} />;
      case 'number':
      case 'integer':
        return <CellForTypeNumberAndInteger schema={schema} value={value} />;
      case 'object':
        return <CellForTypeObject schema={schema} value={value} />;
      case 'array':
        return <CellForTypeArray schema={schema} value={value} />;
      case 'boolean':
        return <CellForTypeBoolean schema={schema} value={value} />;
    }
  }, [schema, value]);

  return <div className="text-xs">{content}</div>;
};
export default Cell;
