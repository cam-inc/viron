import classNames from 'classnames';
import React from 'react';
import { ColorSystem } from '~/types';

// Common props for all button components.
export type BaseButtonProps<T = null> = Pick<
  React.ButtonHTMLAttributes<string>,
  'type' | 'disabled'
> &
  (
    | {
        on: ColorSystem;
        cs?: never;
      }
    | {
        on?: never;
        cs: ColorSystem;
      }
  ) & {
    className?: string;
    size?: Size;
    data?: T;
    rounded?: boolean;
    onClick: (
      data: T,
      event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => void;
  };

export const SIZE = {
  XS: 'xs',
  SM: 'sm',
  BASE: 'base',
  XL: 'xl',
};
export type Size = (typeof SIZE)[keyof typeof SIZE];

export type Props<T = null> = BaseButtonProps<T> & {
  variant?: 'filled' | 'outlined' | 'text';
  label?: string;
  Icon?: React.FC<React.ComponentProps<'svg'>>;
  IconRight?: React.FC<React.ComponentProps<'svg'>>;
};

const Button = function <T = null>({
  cs,
  on,
  variant = 'filled',
  className = '',
  label,
  Icon,
  IconRight,
  disabled = false,
  type = 'button',
  size = SIZE.SM,
  data,
  onClick,
  rounded = variant === 'text' ? false : true,
}: React.PropsWithChildren<Props<T>>): JSX.Element {
  return (
    <button
      className={classNames(
        className,
        'disabled:pointer-events-none disabled:opacity-60 outline-none focus-visible:ring ring-thm-outline overflow-hidden',
        {
          'rounded-full': rounded,
          rounded: !rounded,
          'text-xs h-7': size === SIZE.XS,
          'text-sm h-8': size === SIZE.SM,
          'text-base h-9': size === SIZE.BASE,
          'text-xl h-11': size === SIZE.XL,
          [`bg-thm-${cs} text-thm-on-${cs}`]: variant === 'filled' && !!cs,
          [`bg-thm-on-${on} text-thm-${on}`]: variant === 'filled' && !!on,
          border: variant === 'outlined',
          [`border-thm-${cs} text-thm-${cs}`]: variant === 'outlined' && !!cs,
          [`border-thm-on-${on} text-thm-on-${on}`]:
            variant === 'outlined' && !!on,
          [`text-thm-${cs}`]: variant === 'text' && !!cs,
          [`text-thm-on-${on}`]: variant === 'text' && !!on,
        }
      )}
      type={type}
      disabled={disabled}
      onClick={(event) => onClick(data as T, event)}
    >
      <span className="relative h-full flex items-center gap-1 px-3.5">
        <span
          className={classNames(
            'absolute inset-0 opacity-0 hover:opacity-25 active:opacity-50 transition-opacity',
            {
              [`bg-thm-on-${cs}`]: variant === 'filled' && !!cs,
              [`bg-thm-${on}`]: variant === 'filled' && !!on,
              [`bg-thm-${cs}`]:
                (variant === 'outlined' || variant === 'text') && !!cs,
              [`bg-thm-on-${on}`]:
                (variant === 'outlined' || variant === 'text') && !!on,
            }
          )}
        />
        {Icon && <Icon className="flex-none w-[1.2em]" />}
        {label && <span className="flex-1 truncate text-left">{label}</span>}
        {IconRight && <IconRight className="flex-none w-[1.2em]" />}
      </span>
    </button>
  );
};

export default Button;
