import classnames from 'classnames';
import React from 'react';
import { Props as BaseProps } from '~/components';

type variant = 'circular' | 'rectangular' | 'rounded' | 'text';

const Skelton: React.FC<BaseProps & { variant: variant }> = ({
  on,
  variant,
  className,
}) => {
  return (
    <div
      className={classnames(
        {
          'rounded-full': variant === 'circular',
          rounded: variant === 'rounded',
          // For variant="text", adjust the height via font-size
          "h-auto rounded before:content-['\\00a0']": variant === 'text',
        },
        `bg-thm-on-${on}-slight animate-pulse`,
        className
      )}
    />
  );
};

export default Skelton;
