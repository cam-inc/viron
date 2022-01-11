import classnames from 'classnames';
import React, { useCallback } from 'react';
import { Props as BaseProps } from '~/components';

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
      <ul className={`flex border-b border-thm-on-${on}-slight`}>
        {list.map((item) => (
          <li key={item.id}>
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
export const Item: React.FC<ItemProps> = ({
  on,
  className = '',
  id,
  label,
  isActive,
  onClick,
}) => {
  const handleClick = useCallback(() => {
    onClick(id);
  }, [id, onClick]);

  return (
    <button
      className={classnames(
        `py-2 px-4 text-sm border-b-2`,
        {
          [`text-on-${on} border-transparent`]: !isActive,
          [`text-on-primary border-primary font-bold`]: isActive,
        },
        className
      )}
      onClick={handleClick}
    >
      {label}
    </button>
  );
};
