import classnames from 'classnames';
import React from 'react';
import { On, ON } from '$constants/index';
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
          {
            'border-on-background-faint bg-background text-on-background focus:bg-on-background-faint focus:text-on-background  focus:ring-on-background':
              on === ON.BACKGROUND,
            'border-on-surface-faint bg-surface text-on-surface focus:bg-on-surface-faint focus:text-on-surface  focus:ring-on-surface':
              on === ON.SURFACE,
            'border-on-primary-faint bg-primary text-on-primary focus:bg-on-primary-faint focus:text-on-primary  focus:ring-on-primary':
              on === ON.PRIMARY,
            'border-on-complementary-faint bg-complementary text-on-complementary focus:bg-on-complementary-faint focus:text-on-complementary  focus:ring-on-complementary':
              on === ON.COMPLEMENTARY,
          }
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
