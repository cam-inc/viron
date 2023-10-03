import classnames from 'classnames';
import React, { useMemo } from 'react';
import { Props as BaseProps } from '~/components';
import { Schema } from '~/types/oas';

export type Props = BaseProps & {
  schema: Schema;
  value: string;
};
const CellForTypeString: React.FC<Props> = ({ on, schema, value }) => {
  const content = useMemo<JSX.Element>(() => {
    switch (schema.format) {
      case 'uri':
        return (
          <a
            className={classnames(`text-sm text-thm-on-${on} underline`)}
            href={value}
            target="_blank"
            rel="noopener noreferrer"
          >
            {value}
          </a>
        );
      case 'uri-image':
        return <img className="block" src={value} />;
      default:
        return (
          <div className={classnames(`text-sm text-thm-on-${on}`)}>{value}</div>
        );
    }
  }, [on, schema, value]);
  return <div className="whitespace-nowrap">{content}</div>;
};
export default CellForTypeString;
