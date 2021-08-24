import { IconType } from '@react-icons/all-files';
import classnames from 'classnames';
import React, { useCallback } from 'react';
import { ON, On } from '$constants/index';

export const VARIANT = {
  PAPER: 'paper',
  TEXT: 'text',
  GHOST: 'ghost',
};
export type Variant = typeof VARIANT[keyof typeof VARIANT];

export const SIZE = {
  XXS: 'xxs',
  XS: 'xs',
  SM: 'sm',
  BASE: 'base',
  LG: 'lg',
  XL: 'xl',
  '2XL': '2xl',
};
export type Size = typeof SIZE[keyof typeof SIZE];

export type Props<T> = {
  on: On;
  variant?: Variant;
  size?: Size;
  Icon?: IconType;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  disabled?: React.ButtonHTMLAttributes<HTMLButtonElement>['disabled'];
  label?: string;
  className?: string;
  data?: T;
  onClick?: (data: T) => void;
};
const Button = function <T = null>({
  on,
  variant = VARIANT.PAPER,
  size = SIZE.BASE,
  Icon,
  type,
  disabled,
  label,
  className,
  data,
  onClick,
}: React.PropsWithChildren<Props<T>>): JSX.Element {
  const handleClick = useCallback(
    function () {
      onClick?.(data as T);
    },
    [data, onClick]
  );
  return (
    <button
      type={type}
      disabled={disabled}
      className={classnames(
        'p-2 flex gap-1 items-center rounded focus:outline-none focus:ring-2',
        className,
        {
          // Common
          'text-xxs': size === SIZE.XXS,
          'text-xs': size === SIZE.XS,
          'text-sm': size === SIZE.SM,
          'text-base': size === SIZE.BASE,
          'text-lg': size === SIZE.LG,
          'text-xl': size === SIZE.XL,
          'text-2xl': size === SIZE['2XL'],
          // Paper
          'bg-on-background-faint text-on-background hover:bg-on-background-slight hover:text-on-background-high focus:ring-on-background-high focus:bg-on-background-slight focus:text-on-background-high active:bg-on-background-slight active:text-on-background-high':
            variant === 'paper' && on === ON.BACKGROUND,
          'bg-on-surface-faint text-on-surface hover:bg-on-surface-slight hover:text-on-surface-high focus:ring-on-surface-high focus:bg-on-surface-slight focus:text-on-surface-high active:bg-on-surface-slight active:text-on-surface-high':
            variant === 'paper' && on === ON.SURFACE,
          'bg-on-primary-faint text-on-primary hover:bg-on-primary-slight hover:text-on-primary-high focus:ring-on-primary-high focus:bg-on-primary-slight focus:text-on-primary-high active:bg-on-primary-slight active:text-on-primary-high':
            variant === 'paper' && on === ON.PRIMARY,
          'bg-on-complementary-faint text-on-complementary hover:bg-on-complementary-slight hover:text-on-complementary-high focus:ring-on-complementary-high focus:bg-on-complementary-slight focus:text-on-complementary-high active:bg-on-complementary-slight active:text-on-complementary-high':
            variant === 'paper' && on === ON.COMPLEMENTARY,
          // Text
          'text-on-background hover:text-on-background-high hover:bg-on-background-faint focus:ring-on-background focus:text-on-background-high focus:bg-on-background-faint active:text-on-background-high active:bg-on-background-faint':
            variant === 'text' && on === ON.BACKGROUND,
          'text-on-surface hover:text-on-surface-high hover:bg-on-surface-faint focus:ring-on-surface focus:text-on-surface-high focus:bg-on-surface-faint active:text-on-surface-high active:bg-on-surface-faint':
            variant === 'text' && on === ON.SURFACE,
          'text-on-primary hover:text-on-primary-high hover:bg-on-primary-faint focus:ring-on-primary focus:text-on-primary-high focus:bg-on-primary-faint active:text-on-primary-high active:bg-on-primary-faint':
            variant === 'text' && on === ON.PRIMARY,
          'text-on-complementary hover:text-on-complementary-high hover:bg-on-complementary-faint focus:ring-on-complementary focus:text-on-complementary-high focus:bg-on-complementary-faint active:text-on-complementary-high active:bg-on-complementary-faint':
            variant === 'text' && on === ON.COMPLEMENTARY,
          // Ghost
          border: variant === 'ghost',
          'border-on-background-slight text-on-background hover:border-on-background hover:text-on-background-high focus:ring-on-background focus:border-on-background focus:text-on-background-high active:border-on-background active:text-on-background-high':
            variant === 'ghost' && on === ON.BACKGROUND,
          'border-on-surface-slight text-on-surface hover:border-on-surface hover:text-on-surface-high focus:ring-on-surface focus:border-on-surface focus:text-on-surface-high active:border-on-surface active:text-on-surface-high':
            variant === 'ghost' && on === ON.SURFACE,
          'border-on-primary-slight text-on-primary hover:border-on-primary hover:text-on-primary-high focus:ring-on-primary focus:border-on-primary focus:text-on-primary-high active:border-on-primary active:text-on-primary-high':
            variant === 'ghost' && on === ON.PRIMARY,
          'border-on-complementary-slight text-on-complementary hover:border-on-complementary hover:text-on-complementary-high focus:ring-on-complementary focus:border-on-complementary focus:text-on-complementary-high active:border-on-complementary active:text-on-complementary-high':
            variant === 'ghost' && on === ON.COMPLEMENTARY,
        }
      )}
      onClick={handleClick}
    >
      {Icon && <Icon />}
      {label && <div className="flex-1 min-w-0 whitespace-nowrap">{label}</div>}
    </button>
  );
};

export default Button;
