import classnames from 'classnames';
import React from 'react';
import { Props as BaseProps } from '~/components';
import ExternalLinkIcon from '~/components/icon/externalLink/outline';
import Link from '~/components/link';
import { URL } from '~/constants';
import { Pathname, URL as _URL } from '~/types';

const links: {
  to: Pathname | _URL;
  label: string;
  isExternal: boolean;
}[] = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    isExternal: false,
  },
  {
    to: URL.DOCUMENTATION,
    label: 'Documentation',
    isExternal: true,
  },
  {
    to: URL.BLOG,
    label: 'Blog',
    isExternal: true,
  },
  {
    to: URL.RELEASE_NOTES,
    label: 'Release Notes',
    isExternal: true,
  },
  {
    to: URL.HELP,
    label: 'Help',
    isExternal: true,
  },
];

type Props = BaseProps;
const Links: React.FC<Props> = ({ className = '', on }) => {
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
              <div>{item.label}</div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};
export default Links;
