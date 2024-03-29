import classnames from 'classnames';
import React from 'react';
import { Props as BaseProps } from '~/components';
import ExternalLinkIcon from '~/components/icon/externalLink/outline';
import Link from '~/components/link';
import { URL } from '~/constants';
import { useTranslation } from '~/hooks/i18n';
import { Pathname, URL as _URL } from '~/types';

const links: {
  to: Pathname | _URL;
  label: string;
  isExternal: boolean;
}[] = [
  {
    to: URL.DOCUMENTATION,
    label: 'documentation',
    isExternal: true,
  },
  /*
    {
      to: URL.BLOG,
      label: 'Blog',
      isExternal: true,
    },
    */
  {
    to: URL.RELEASE_NOTES,
    label: 'releaseNotes',
    isExternal: true,
  },
  {
    to: URL.HELP,
    label: 'help',
    isExternal: true,
  },
];

type Props = BaseProps;
const Links: React.FC<Props> & {
  renewal: React.FC<Props>;
} = ({ className = '', on }) => {
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
          <Link className="group focus:outline-none" to={item.to}>
            <div
              className={`flex gap-1 items-center text-thm-on-${on} group-hover:underline group-active:text-thm-on-${on}-low group-focus:ring-2 group-focus:ring-thm-on-${on}`}
            >
              {item.isExternal && <ExternalLinkIcon className="w-em" />}
              <div>{t(item.label)}</div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};
const Renewal: React.FC<Props> = ({ className = '', on }) => {
  const { t } = useTranslation();
  return (
    <ul className={className}>
      {links.map((item) => (
        <li key={item.to}>
          <Link
            className={`flex gap-2 text-sm items-center text-thm-on-${on} hover:underline active:text-thm-on-${on}-low focus:outline outline-2 outline-thm-outline`}
            to={item.to}
          >
            {item.isExternal && <ExternalLinkIcon className="w-[1.42em]" />}
            <div>{t(item.label)}</div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

Links.renewal = Renewal;

export default Links;
