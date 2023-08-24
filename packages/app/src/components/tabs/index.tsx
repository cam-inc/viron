import classnames from 'classnames';
import React, { useCallback } from 'react';
import { Props as BaseProps } from '~/components';
import Button, { Props as ButtonProps } from '~/components/button';

export type Props = BaseProps & {
  list: Omit<ItemProps, 'on' | 'className' | 'onClick'>[];
  onChange: (id: ItemProps['id']) => void;
};
const Tabs: React.FC<Props> & {
  renewal: React.FC<Props>;
} = ({ on, className = '', list, onChange }) => {
  const handleItemClick = useCallback<ItemProps['onClick']>(
    (id) => {
      onChange(id);
    },
    [onChange]
  );

  return (
    <div className={className}>
      <ul className={`flex border-y border-thm-on-${on}-slight`}>
        {list.map((item) => (
          <li
            key={item.id}
            className={classnames(`p-2 border-thm-on-${on}-low`, {
              'border-b-2': item.isActive,
            })}
          >
            <Item on={on} {...item} onClick={handleItemClick} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const Renewal: React.FC<Props> = ({ on, className = '', list, onChange }) => {
  const handleItemClick = useCallback<ItemProps['onClick']>(
    (id) => {
      onChange(id);
    },
    [onChange]
  );

  return (
    <div className={className}>
      <ul className={`flex border-b border-thm-on-${on}-slight`}>
        {list.map((item) => (
          <li
            key={item.id}
            className={classnames('w-[178px]', {
              'border-b-2 border-thm-primary': item.isActive,
            })}
          >
            <button
              onClick={() => handleItemClick(item.id)}
              className={classnames('block p-2 w-full text-sm', {
                'font-bold': item.isActive,
              })}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
Tabs.renewal = Renewal;

export default Tabs;

type ItemProps = BaseProps & {
  id: string;
  label: string;
  isActive: boolean;
  onClick: (id: ItemProps['id']) => void;
};
export const Item: React.FC<ItemProps> = ({ on, id, label, onClick }) => {
  const handleClick = useCallback<ButtonProps['onClick']>(() => {
    onClick(id);
  }, [id, onClick]);

  return <Button on={on} label={label} onClick={handleClick} />;
};
