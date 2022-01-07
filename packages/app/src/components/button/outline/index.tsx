import classnames from 'classnames';
import React, { useCallback } from 'react';
import { Props as BaseProps } from '~/components';
import { Props as BaseButtonProps, SIZE } from '~/components/button';

export type Props<T = null> = BaseProps<'cs'> &
  BaseButtonProps<T> & {
    label: string;
    Icon?: React.FC<React.ComponentProps<'svg'>>;
  };
const OutlineButton = function <T = null>({
  cs,
  className = '',
  label,
  Icon,
  disabled = false,
  type = 'button',
  size = SIZE.SM,
  data,
  onClick,
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
          className={`absolute inset-0 pointer-events-none rounded bg-thm-${cs} opacity-0 group-hover:opacity-25 group-active:opacity-50`}
        />
        <div
          className={`absolute inset-0 pointer-events-none rounded opacity-50 group-focus:ring-4 group-focus:ring-thm-${cs}`}
        />
        <div
          className={classnames(
            `relative flex items-center gap-1 px-2 py-1 rounded border border-thm-${cs} text-thm-${cs}`,
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
          <div className="flex-1">{label}</div>
        </div>
      </div>
    </button>
  );
};
export default OutlineButton;
