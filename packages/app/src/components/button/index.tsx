import { IconType } from '@react-icons/all-files';
import classnames from 'classnames';
import React from 'react';

type Props = {
  on: 'background' | 'surface' | 'primary' | 'complementary';
  variant?: 'paper' | 'text' | 'ghost';
  size?: 'xxs' | 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  Icon?: IconType;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  disabled?: React.ButtonHTMLAttributes<HTMLButtonElement>['disabled'];
  label?: string;
  className?: string;
  onClick?: () => void;
};
const Button: React.FC<Props> = ({
  on,
  variant = 'paper',
  size = 'base',
  Icon,
  type,
  disabled,
  label,
  className,
  onClick,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={classnames(
        'p-2 flex items-center rounded focus:outline-none focus:ring-2',
        className,
        {
          // Common
          'text-xxs': size === 'xxs',
          'text-xs': size === 'xs',
          'text-sm': size === 'sm',
          'text-base': size === 'base',
          'text-lg': size === 'lg',
          'text-xl': size === 'xl',
          'text-2xl': size === '2xl',
          // Paper
          'bg-on-background-faint text-on-background hover:bg-on-background-low hover:text-on-background-high focus:ring-on-background-high active:bg-on-background-low active:text-on-background-high':
            variant === 'paper' && on === 'background',
          'bg-on-surface-faint text-on-surface hover:bg-on-surface-low hover:text-on-surface-high focus:ring-on-surface-high active:bg-on-surface-low active:text-on-surface-high':
            variant === 'paper' && on === 'surface',
          'bg-on-primary-faint text-on-primary hover:bg-on-primary-low hover:text-on-primary-high focus:ring-on-primary-high active:bg-on-primary-low active:text-on-primary-high':
            variant === 'paper' && on === 'primary',
          'bg-on-complementary-faint text-on-complementary hover:bg-on-complementary-low hover:text-on-complementary-high focus:ring-on-complementary-high active:bg-on-complementary-low active:text-on-complementary-high':
            variant === 'paper' && on === 'complementary',
          // Text
          'text-on-background hover:bg-on-background-faint focus:ring-on-background active:bg-on-background-faint':
            variant === 'text' && on === 'background',
          'text-on-surface hover:bg-on-surface-faint focus:ring-on-surface active:bg-on-surface-faint':
            variant === 'text' && on === 'surface',
          'text-on-primary hover:bg-on-primary-faint focus:ring-on-primary active:bg-on-primary-faint':
            variant === 'text' && on === 'primary',
          'text-on-complementary hover:bg-on-complementary-faint focus:ring-on-complementary active:bg-on-complementary-faint':
            variant === 'text' && on === 'complementary',
          // Ghost
          border: variant === 'ghost',
          'border-on-background text-on-background hover:bg-on-background-faint focus:ring-on-background active:bg-on-background-faint':
            variant === 'ghost' && on === 'background',
          'border-on-surface text-on-surface hover:bg-on-surface-faint focus:ring-on-surface active:bg-on-surface-faint':
            variant === 'ghost' && on === 'surface',
          'border-on-primary text-on-primary hover:bg-on-primary-faint focus:ring-on-primary active:bg-on-primary-faint':
            variant === 'ghost' && on === 'primary',
          'border-on-complementary text-on-complementary hover:bg-on-complementary-faint focus:ring-on-complementary active:bg-on-complementary-faint':
            variant === 'ghost' && on === 'complementary',
        }
      )}
      onClick={onClick}
    >
      {Icon && <Icon className={classnames({ 'mr-1': !!label })} />}
      {label && <div className="flex-1 min-w-0">{label}</div>}
    </button>
  );
};

export default Button;
