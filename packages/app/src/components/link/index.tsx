// eslint-disable-next-line no-restricted-imports
import { Link as I18nextLink } from 'gatsby-plugin-react-i18next';
import React, { ComponentProps } from 'react';
import { Props as BaseProps } from '~/components';

type Props = Omit<BaseProps, 'on'> &
  Pick<ComponentProps<typeof I18nextLink>, 'to' | 'language'>;
const Link: React.FC<Props> = ({ className = '', to, language, children }) => {
  const isInternal = /^\/(?!\/)/.test(to);
  if (isInternal) {
    return (
      // TODO: 直す
      // @ts-expect-error
      <I18nextLink to={to} className={className} language={language}>
        {children}
      </I18nextLink>
    );
  } else {
    return (
      <a href={to} className={className} target="_blank">
        {children}
      </a>
    );
  }
};
export default Link;
