import classnames from 'classnames';
import React from 'react';

type Props = {
  elevation: number;
  shadowElevation: number;
  square?: boolean;
};
const Paper: React.FC<Props> = ({
  elevation,
  shadowElevation,
  square = false,
  children,
}) => {
  return (
    <div
      className={classnames(
        `text-on-surface bg-surface-0${elevation}dp shadow-0${shadowElevation}dp border border-on-surface-faint`,
        {
          rounded: !square,
        }
      )}
    >
      {children}
    </div>
  );
};
export default Paper;
