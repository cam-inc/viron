import React from 'react';
import { ClassName } from '$types/index';

type Props<T> = {
  list: T[];
  Select: React.FC<{ className: ClassName }>;
  Option: React.FC<{ className: ClassName; data: T }>;
  OptionBlank?: React.FC<{ className: ClassName }>;
};
const _Select = function <T>({
  list,
  Select,
  Option,
  OptionBlank,
}: React.PropsWithChildren<Props<T>>): JSX.Element {
  return (
    <div>
      <Select className="p-1 bg-background text-on-background border border-on-background-faint rounded focus:bg-surface focus:text-on-surface focus:outline-none focus:ring-2 focus:ring-on-surface">
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
