import classnames from 'classnames';
import React from 'react';
import { Props as BaseProps } from '~/components';
import { ClassName } from '~/types';

type Props<T> = BaseProps & {
  list: T[];
  Select: React.FC<{ className: ClassName }>;
  Option: React.FC<{ className: ClassName; data: T }>;
  OptionBlank?: React.FC<{ className: ClassName }>;
};
const _Select = function <T>({
  on,
  list,
  Select,
  Option,
  OptionBlank,
}: React.PropsWithChildren<Props<T>>): JSX.Element {
  return (
    <div>
      <Select
        className={classnames(
          'block w-full p-1 border rounded focus:outline-none focus:ring-2',
          `border-thm-on-${on}-faint bg-thm-${on} text-thm-on-${on} focus:bg-thm-on-${on}-faint focus:text-thm-on-${on}  focus:ring-thm-on-${on}`
        )}
      >
        {OptionBlank && <OptionBlank className="p-1" />}
        {list.map((item, idx) => (
          <React.Fragment key={idx}>
            <Option className="p-1" data={item} />
          </React.Fragment>
        ))}
      </Select>
    </div>
  );
};
export default _Select;
