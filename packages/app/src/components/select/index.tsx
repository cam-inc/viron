import classnames from 'classnames';
import React from 'react';
import { On } from '$constants/index';
import { ClassName } from '$types/index';

type Props<T> = {
  on: On;
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
          `border-on-${on}-faint bg-${on} text-on-${on} focus:bg-on-${on}-faint focus:text-on-${on}  focus:ring-on-${on}`
        )}
      >
        {OptionBlank && <OptionBlank className="p-1" />}
        {list.map(function (item, idx) {
          return (
            <React.Fragment key={idx}>
              <Option className="p-1" data={item} />
            </React.Fragment>
          );
        })}
      </Select>
    </div>
  );
};
export default _Select;
