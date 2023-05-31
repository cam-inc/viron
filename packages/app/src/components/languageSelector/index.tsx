import classnames from 'classnames';
import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { Props as BaseProps } from '~/components';
import Link from '~/components/link';
import { useTranslation } from '~/hooks/i18n';

type Props = BaseProps;
const NavigationSelector: React.FC<Props> = ({ className = '', on }) => {
  const { t } = useTranslation();
  const { languages, originalPath } = useI18next();
  return (
    <ul
      className={classnames('flex justify-center text-xs divide-x', className)}
    >
      {languages.map((lng) => (
        <li key={lng}>
          <Link
            className={`mx-2 block hover:underline focus:outline-none active:text-thm-on-${on}-low focus:ring-2 focus:ring-thm-on-${on}`}
            to={originalPath}
            language={lng}
          >
            {t(`language.${lng}`)}
          </Link>
        </li>
      ))}
    </ul>
  );
};
export default NavigationSelector;
