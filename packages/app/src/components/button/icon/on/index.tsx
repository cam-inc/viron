import classnames from 'classnames';
import React, { useCallback } from 'react';
import { Props as BaseProps } from '~/components';
import { Props as BaseButtonProps, SIZE } from '~/components/button';

export type Props<T = null> = BaseProps & BaseButtonProps<T>;
const IconButton = function <T = null>({
  on,
  className = '',
  disabled = false,
  type = 'button',
  size = SIZE.BASE,
  data,
  onClick,
  children,
  rounded = true,
}: React.PropsWithChildren<Props<T>>): JSX.Element {
  const handleClick = useCallback(() => {
    onClick(data as T);
  }, [data, onClick]);

  return (
    <button
      className={classnames(
        `flex items-center justify-center disabled:pointer-events-none disabled:opacity-60 transition-color hover:bg-thm-on-${on}-slight active:bg-thm-on-${on}-low outline-thm-outline`,
        className,
        {
          rounded: rounded,
          'h-11 w-11 text-xl': size === SIZE.BASE,
        }
      )}
      type={type}
      disabled={disabled}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
export default IconButton;
