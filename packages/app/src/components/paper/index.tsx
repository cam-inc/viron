import classnames from 'classnames';
import React from 'react';
import { ClassName } from '$types/index';

type Props = {
  elevation: 0 | 1 | 2 | 3 | 4 | 5;
  shadowElevation: 0 | 1 | 2 | 3 | 4 | 5;
  className?: ClassName;
  square?: boolean;
};
const Paper: React.FC<Props> = ({
  elevation,
  shadowElevation,
  className = '',
  square = false,
  children,
}) => {
  return (
    <div
      className={classnames(
        `text-on-surface border border-on-surface-faint`,
        {
          // Avoid using string concatenation.
          // @see: https://tailwindcss.com/docs/optimizing-for-production#writing-purgeable-html
          'bg-surface-00dp': elevation === 0,
          'bg-surface-01dp': elevation === 1,
          'bg-surface-02dp': elevation === 2,
          'bg-surface-03dp': elevation === 3,
          'bg-surface-04dp': elevation === 4,
          'bg-surface-05dp': elevation === 5,
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
