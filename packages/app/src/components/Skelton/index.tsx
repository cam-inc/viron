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
        variant === 'circular' && 'rounded-full',
        variant === 'rounded' && 'rounded',
        // For variant="text", adjust the height via font-size
        variant === 'text' && "h-auto rounded before:content-['\\00a0']",
        `bg-thm-on-${on}-slight animate-pulse`,
        className
      )}
    />
  );
};

export default Skelton;
