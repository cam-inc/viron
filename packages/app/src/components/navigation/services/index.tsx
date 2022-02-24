import React from 'react';
import { Props as BaseProps } from '~/components';
import GithubIcon from '~/components/icon/github/solid';
import TwitterIcon from '~/components/icon/twitter/solid';
import Link from '~/components/link';
import { URL } from '~/constants';
import { Pathname, URL as _URL } from '~/types';

const links: {
  to: Pathname | _URL;
  icon: JSX.Element;
}[] = [
  {
    to: URL.GITHUB,
    icon: <GithubIcon className="w-em" />,
  },
  {
    to: URL.TWITTER,
    icon: <TwitterIcon className="w=em" />,
  },
];

type Props = BaseProps;
const Services: React.FC<Props> = ({ on }) => {
  return (
    <ul className="flex justify-center gap-2 text-2xl">
      {links.map((item) => (
        <li key={item.to}>
          <Link className="block group focus:outline-none" on={on} to={item.to}>
            <div
              className={`text-2xl text-thm-on-${on} group-hover:text-thm-on-${on}-low group-active:text-thm-on-${on}-slight group-focus:ring-2 group-focus:ring-thm-on-${on}`}
            >
              {item.icon}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};
export default Services;
