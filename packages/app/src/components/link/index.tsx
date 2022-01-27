import { Link as GatsbyLink, GatsbyLinkProps } from 'gatsby';
import React from 'react';
import { Props as BaseProps } from '~/components';

type Props = BaseProps & Pick<GatsbyLinkProps<Record<string, string>>, 'to'>;
const Link: React.FC<Props> = ({ className = '', to, children }) => {
  const isInternal = /^\/(?!\/)/.test(to);
  if (isInternal) {
    return (
      <GatsbyLink to={to} className={className}>
        {children}
      </GatsbyLink>
    );
  } else {
    return (
      <a href={to} className={className}>
        {children}
      </a>
    );
  }
};
export default Link;
