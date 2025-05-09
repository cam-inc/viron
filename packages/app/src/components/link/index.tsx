// eslint-disable-next-line no-restricted-imports
import { Link as I18nextLink } from 'gatsby-plugin-react-i18next';
import React, { ComponentProps, forwardRef } from 'react';
import { Props as BaseProps } from '@/components';

type Props = BaseProps &
  Pick<ComponentProps<typeof I18nextLink>, 'to' | 'language'>;

const Link = forwardRef<HTMLAnchorElement, Props>(
  ({ className = '', to, language, children, ...props }, ref) => {
    const isInternal = /^\/(?!\/)/.test(to);
    if (isInternal) {
      return (
        // TODO: 直す
        // @ts-expect-error
        <I18nextLink
          to={to}
          className={className}
          language={language}
          ref={ref}
          {...props}
        >
          {children}
        </I18nextLink>
      );
    } else {
      return (
        <a href={to} className={className} target="_blank" ref={ref} {...props}>
          {children}
        </a>
      );
    }
  }
);

Link.displayName = 'Link';
export default Link;
