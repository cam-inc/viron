import classnames from 'classnames';
import React from 'react';
import { Props as BaseProps } from '~/components';

type Props = BaseProps & {
  shadowElevation: 0 | 1 | 2 | 3 | 4 | 5;
  square?: boolean;
};
const Paper: React.FC<Props> = ({
  on,
  className = '',
  shadowElevation,
  square = false,
  children,
}) => {
  return (
    <div
      className={classnames(
        `bg-thm-${on} text-thm-on-${on} border border-thm-on-${on}-faint`,
        {
          'shadow-00dp': shadowElevation === 0,
          'shadow-01dp': shadowElevation === 1,
          'shadow-02dp': shadowElevation === 2,
          'shadow-03dp': shadowElevation === 3,
          'shadow-04dp': shadowElevation === 4,
          'shadow-05dp': shadowElevation === 5,
          rounded: !square,
        },
        className
      )}
    >
      {children}
    </div>
  );
};
export default Paper;
