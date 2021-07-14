import classnames from 'classnames';
import { Link as GatsbyLink, GatsbyLinkProps } from 'gatsby';
import React from 'react';
import { ON, On } from '$constants/index';

type Props = {
  on: On;
  className?: string;
} & Pick<GatsbyLinkProps<Record<string, string>>, 'to'>;
const Link: React.FC<Props> = ({ on, className = '', to, children }) => {
  const _className = classnames('focus:outline-none focus:ring-2', className, {
    'text-on-background hover:text-on-background-high focus:ring-on-background active:text-on-background-high':
      on === ON.BACKGROUND,
    'text-on-surface hover:text-on-surface-high focus:ring-on-surface active:text-on-surface-high':
      on === ON.SURFACE,
    'text-on-primary hover:text-on-primary-high focus:ring-on-primary active:text-on-primary-high':
      on === ON.PRIMARY,
    'text-on-complementary hover:text-on-complementary-high focus:ring-on-complementary active:text-on-complementary-high':
      on === ON.COMPLEMENTARY,
  });

  const isInternal = /^\/(?!\/)/.test(to);
  if (isInternal) {
    return (
      <GatsbyLink to={to} className={_className}>
        {children}
      </GatsbyLink>
    );
  } else {
    return (
      <a href={to} className={_className}>
        {children}
      </a>
    );
  }
};
export default Link;
