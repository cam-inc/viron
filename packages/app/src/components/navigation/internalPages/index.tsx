import classnames from 'classnames';
import classNames from 'classnames';
import React from 'react';
import { Props as BaseProps } from '~/components';
import DashboardOutlineIcon from '~/components/icon/dashboard/outline';
import GroupOutlineIcon from '~/components/icon/group/outline';
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
    to: INTERNAL_PAGE_PATHS.ENDPOINTS,
    label: 'internalPagePaths.dashboard',
    icon: <DashboardOutlineIcon className="w-[1.42em] h-[1.42em]" />,
  },
  {
    to: INTERNAL_PAGE_PATHS.GROUPS,
    label: 'internalPagePaths.groups',
    icon: <GroupOutlineIcon className="w-[1.42em] h-[1.42em]" />,
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
              'flex gap-2 text-sm items-center p-2 rounded active:opacity-50 focus-visible:outline outline-2 outline-thm-outline',
              {
                [`bg-thm-on-${on}-low text-thm-${on} hover:opacity-75`]:
                  originalPath.startsWith(item.to),
                [`text-thm-on-${on} hover:bg-thm-on-${on}-faint`]:
                  !originalPath.startsWith(item.to),
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
