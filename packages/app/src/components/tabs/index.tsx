import classnames from 'classnames';
import React, { useCallback } from 'react';
import { Props as BaseProps } from '~/components';
import FilledOnButton, {
  Props as FilledOnButtonProps,
} from '~/components/button/filled/on';

export type Props = BaseProps & {
  list: Omit<ItemProps, 'on' | 'className' | 'onClick'>[];
  onChange: (id: ItemProps['id']) => void;
};
const Tabs: React.FC<Props> = ({ on, className = '', list, onChange }) => {
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
export default Tabs;

type ItemProps = BaseProps & {
  id: string;
  label: string;
  isActive: boolean;
  onClick: (id: ItemProps['id']) => void;
};
export const Item: React.FC<ItemProps> = ({ on, id, label, onClick }) => {
  const handleClick = useCallback<FilledOnButtonProps['onClick']>(() => {
    onClick(id);
  }, [id, onClick]);

  return <FilledOnButton on={on} label={label} onClick={handleClick} />;
};
