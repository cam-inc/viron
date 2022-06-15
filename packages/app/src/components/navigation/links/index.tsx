import classnames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Props as BaseProps } from '~/components';
import ExternalLinkIcon from '~/components/icon/externalLink/outline';
import Link from '~/components/link';
import { URL } from '~/constants';
import { Pathname, URL as _URL } from '~/types';

const links: {
  to: Pathname | _URL;
  key: string;
  isExternal: boolean;
}[] = [
  {
    to: '/',
    key: 'home',
    isExternal: false,
  },
  {
    to: '/dashboard/endpoints',
    key: 'dashboard',
    isExternal: false,
  },
  {
    to: URL.DOCUMENTATION,
    key: 'documentation',
    isExternal: true,
  },
  /*
      {
        to: URL.BLOG,
        key: 'blog',
        isExternal: true,
      },
      */
  {
    to: URL.RELEASE_NOTES,
    key: 'releaseNotes',
    isExternal: true,
  },
  {
    to: URL.HELP,
    key: 'help',
    isExternal: true,
  },
];

type Props = BaseProps;
const Links: React.FC<Props> = ({ className = '', on }) => {
  const { t } = useTranslation();
  return (
    <ul
      className={classnames(
        `flex flex-col gap-2 items-center text-xs`,
        className
      )}
    >
      {links.map((item) => (
        <li key={item.to}>
          <Link className="group focus:outline-none" on={on} to={item.to}>
            <div
              className={`flex gap-1 items-center text-thm-on-${on} group-hover:underline group-active:text-thm-on-${on}-low group-focus:ring-2 group-focus:ring-thm-on-${on}`}
            >
              {item.isExternal && <ExternalLinkIcon className="w-em" />}
              <div>{t(`common.${item.key}`)}</div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};
export default Links;
