import React, { useMemo } from 'react';
import { Props as BaseProps } from '@/components';
import { Schema } from '@/types/oas';

export type Props = BaseProps & {
  schema: Schema;
  value: string;
};
const CellForTypeString: React.FC<Props> = ({ schema, value }) => {
  const content = useMemo<JSX.Element>(() => {
    switch (schema.format) {
      case 'uri':
        return (
          <a
            className="text-sm underline"
            href={value}
            target="_blank"
            rel="noopener noreferrer"
          >
            {value}
          </a>
        );
      case 'uri-image':
        return (
          <div className="size-20">
            <img
              className="block size-full object-contain"
              src={value}
              alt=""
            />
          </div>
        );
      default:
        return <div className="text-sm">{value}</div>;
    }
  }, [schema, value]);
  return <div className="whitespace-nowrap truncate">{content}</div>;
};
export default CellForTypeString;
