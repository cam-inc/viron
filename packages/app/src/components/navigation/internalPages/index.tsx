import classnames from 'classnames';
import classNames from 'classnames';
import React from 'react';
import { Props as BaseProps } from '~/components';
import BarsOutLineIcon from '~/components/icon/bars/outline';
import Link from '~/components/link';
import { INTERNAL_PAGE_PATHS } from '~/constants';
import { useI18n, useTranslation } from '~/hooks/i18n';
import { Pathname, URL as _URL } from '~/types';

const paths: {
  to: Pathname | _URL;
  activeStartsWith: Pathname | _URL;
  label: string;
  icon: JSX.Element;
}[] = [
  {
    to: INTERNAL_PAGE_PATHS.ENDPOINTS,
    activeStartsWith: INTERNAL_PAGE_PATHS.DASHBOARD,
    label: 'internalPagePaths.dashboard',
    icon: <BarsOutLineIcon className="w-[1.42em] h-[1.42em]" />,
  },
];

type Props = BaseProps;
const InternalPages: React.FC<Props> = ({ className = '', on }) => {
  const { t } = useTranslation();

  const { originalPath } = useI18n();

  return (
    <ul className={classnames(className)}>
      {paths.map((item) => (
        <li key={item.to}>
          <Link
            className={classNames(
              'flex gap-2 text-sm items-center p-2 rounded active:opacity-50',
              {
                [`bg-thm-on-${on}-low text-thm-on-${on}-faint hover:opacity-75 focus:outline outline-2 outline-thm-${on}`]:
                  originalPath.startsWith(item.activeStartsWith),
                [`text-thm-on-${on}  hover:opacity-75 focus:outline outline-2 outline-thm-${on}`]:
                  !originalPath.startsWith(item.activeStartsWith),
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
