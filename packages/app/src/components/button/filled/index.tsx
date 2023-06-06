import classnames from 'classnames';
import React, { useCallback } from 'react';
import { Props as BaseProps } from '~/components';
import { Props as BaseButtonProps, SIZE } from '~/components/button';

export type Props<T = null> = BaseProps<'cs'> &
  BaseButtonProps<T> & {
    label?: string;
    Icon?: React.FC<React.ComponentProps<'svg'>>;
    IconRight?: React.FC<React.ComponentProps<'svg'>>;
  };
const FilledButton = function <T = null>({
  cs,
  className = '',
  label,
  Icon,
  IconRight,
  disabled = false,
  type = 'button',
  size = SIZE.SM,
  data,
  onClick,
  rounded = true,
  pl,
}: React.PropsWithChildren<Props<T>>): JSX.Element {
  const handleClick = useCallback(() => {
    onClick(data as T);
  }, [data, onClick]);

  return (
    <button
      className={classnames('group focus:outline-none', className)}
      type={type}
      disabled={disabled}
      onClick={handleClick}
    >
      <div className="relative">
        <div
          style={{
            paddingLeft: pl,
          }}
          className={classnames(
            `absolute inset-0 pointer-events-none bg-thm-${cs} group-hover:opacity-75 group-active:opacity-50`,
            {
              rounded: rounded,
            }
          )}
        />
        <div
          style={{
            paddingLeft: pl,
          }}
          className={classnames(
            `absolute inset-0 pointer-events-none opacity-50 group-focus:ring-4 group-focus:ring-thm-${cs}`,
            {
              rounded: rounded,
            }
          )}
        />
        <div
          style={{
            paddingLeft: pl,
          }}
          className={classnames(
            `relative flex items-center gap-1 px-2 py-1 text-thm-on-${cs}`,
            {
              'text-xxs': size === SIZE.XXS,
              'text-xs': size === SIZE.XS,
              'text-sm': size === SIZE.SM,
              'text-base': size === SIZE.BASE,
              'text-xl': size === SIZE.XL,
              'text-2xl': size === SIZE['2XL'],
            }
          )}
        >
          {Icon && (
            <div className="flex-none">
              <Icon className="w-[1.2em]" />
            </div>
          )}
          {label && <div className="flex-1 text-left truncate">{label}</div>}
          {IconRight && (
            <div className="flex-none">
              <IconRight className="w-[1.2em]" />
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

const Renewal = function <T = null>({
  cs,
  className = '',
  label,
  Icon,
  IconRight,
  disabled = false,
  type = 'button',
  size = SIZE.SM,
  data,
  onClick,
  rounded = true,
  pl,
}: React.PropsWithChildren<Props<T>>): JSX.Element {
  const handleClick = useCallback(() => {
    onClick(data as T);
  }, [data, onClick]);

  return (
    <button
      style={{
        paddingLeft: pl,
      }}
      className={classnames(
        `flex items-center gap-1 px-3 py-2 bg-thm-${cs} hover:opacity-75 active:opacity-50 focus:outline outline-4 outline-thm-outline text-thm-on-${cs}`,
        {
          'rounded-full': rounded,
          'text-xxs': size === SIZE.XXS,
          'text-xs': size === SIZE.XS,
          'text-sm': size === SIZE.SM,
          'text-base': size === SIZE.BASE,
          'text-xl': size === SIZE.XL,
          'text-2xl': size === SIZE['2XL'],
        },
        className
      )}
      type={type}
      disabled={disabled}
      onClick={handleClick}
    >
      {Icon && (
        <span className="flex-none">
          <Icon className="w-[1.2em]" />
        </span>
      )}
      {label && <span className="flex-1 truncate">{label}</span>}
      {IconRight && (
        <span className="flex-none">
          <IconRight className="w-[1.2em]" />
        </span>
      )}
    </button>
  );
};

FilledButton.renewal = Renewal;

export default FilledButton;
