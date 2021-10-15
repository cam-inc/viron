import { IconType } from '@react-icons/all-files';
import classnames from 'classnames';
import React, { useCallback } from 'react';
import { On } from '$constants/index';

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
  onClick?: (data: T, e: React.MouseEvent) => void;
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
    function (e) {
      onClick?.(data as T, e);
    },
    [data, onClick]
  );
  function styles(on: On, variant: Variant) {
    switch (variant) {
      case 'paper':
        return `bg-on-${on}-faint text-on-${on} hover:bg-on-${on}-slight hover:text-on-${on}-high focus:ring-on-${on}-high focus:bg-on-${on}-slight focus:text-on-${on}-high active:bg-on-${on}-slight active:text-on-${on}-high`;
      case 'text':
        return `text-on-${on} hover:text-on-${on}-high hover:bg-on-${on}-faint focus:ring-on-${on} focus:text-on-${on}-high focus:bg-on-${on}-faint active:text-on-${on}-high active:bg-on-${on}-faint`;
      case 'ghost':
        return `border border-on-${on}-slight text-on-${on} hover:border-on-${on} hover:text-on-${on}-high focus:ring-on-${on} focus:border-on-${on} focus:text-on-${on}-high active:border-on-${on} active:text-on-${on}-high`;
      default:
        return '';
    }
  }
  return (
    <button
      type={type}
      disabled={disabled}
      className={classnames(
        'p-2 flex gap-1 items-center rounded focus:outline-none focus:ring-2',
        styles(on, variant),
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
