import classNames from 'classnames';
import React from 'react';
import { Props as BaseButtonProps, SIZE } from '~/components/button';

export type Props<T = null> = BaseButtonProps<T>;
const IconButton = function <T = null>({
  on,
  cs,
  className = '',
  disabled = false,
  type = 'button',
  size = SIZE.BASE,
  data,
  onClick,
  children,
  rounded = false,
}: React.PropsWithChildren<Props<T>>): JSX.Element {
  return (
    <button
      className={classNames(
        className,
        'disabled:pointer-events-none disabled:opacity-60 outline-none focus-visible:ring ring-thm-outline overflow-hidden',
        {
          'rounded-full': rounded,
          rounded: !rounded,
          'h-11 w-11 text-xl': size === SIZE.BASE,
        }
      )}
      type={type}
      disabled={disabled}
      onClick={() => onClick(data as T)}
    >
      <span className="relative h-full flex items-center justify-center">
        <span
          className={classNames(
            'absolute inset-0 opacity-0 hover:opacity-25 active:opacity-50 transition-opacity',
            {
              [`bg-thm-${cs}`]: !!cs,
              [`bg-thm-on-${on}`]: !!on,
            }
          )}
        />
        {children}
      </span>
    </button>
  );
};
export default IconButton;
