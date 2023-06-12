import classnames from 'classnames';
import classNames from 'classnames';
import React from 'react';
import { Props as BaseProps } from '~/components';
import BarsOutLineIcon from '~/components/icon/bars/outline';
import HomeOutlineIcon from '~/components/icon/home/outline';
import Link from '~/components/link';
import { INTERNAL_PAGE_PATHS } from '~/constants';
import { useI18n, useTranslation } from '~/hooks/i18n';
import { Pathname, URL as _URL } from '~/types';

const paths: {
  to: Pathname | _URL;
  label: string;
  icon: JSX.Element;
}[] = [
  {
    to: INTERNAL_PAGE_PATHS.ROOT,
    label: 'internalPagePaths.root',
    icon: <HomeOutlineIcon className="w=em" />,
  },
  {
    to: INTERNAL_PAGE_PATHS.ENDPOINTS,
    label: 'internalPagePaths.endpoints',
    icon: <BarsOutLineIcon className="w=em" />,
  },
];

type Props = BaseProps;
const InternalPages: React.FC<Props> = ({ className = '', on }) => {
  const { t } = useTranslation();

  const { originalPath } = useI18n();
  console.log(originalPath, on);
  return (
    <ul className={classnames(className)}>
      {paths.map((item) => (
        <li key={item.to}>
          <Link
            className={classNames(
              'flex gap-1 text-xs items-center pl-2 py-1 rounded-lg active:opacity-50',
              {
                [`bg-thm-on-${on} text-thm-${on} hover:bg-thm-on-${on}-low focus:outline outline-2 outline-thm-${on}`]:
                  item.to === originalPath,
                [`text-thm-on-${on} hover:bg-thm-on-${on}-low hover:text-thm-${on} focus:outline outline-2 outline-thm-${on}`]:
                  item.to !== originalPath,
              }
            )}
            to={item.to}
          >
            {item.icon}
            {t(item.label)}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default InternalPages;
