import { BiLinkExternal } from '@react-icons/all-files/bi/BiLinkExternal';
import classnames from 'classnames';
import React from 'react';
import Link from '$components/link';
import { On, URL } from '$constants/index';

type Props = {
  on: On;
};
const Links: React.FC<Props> = ({ on }) => {
  const _className = classnames(
    'hover:underline focus:outline-none focus:ring-2',
    `text-on-${on} focus:ring-on-${on} active:text-on-${on}-high`
  );

  return (
    <ul className="flex flex-col gap-2 items-center text-xs">
      <li>
        <Link on={on} to="/dashboard">
          <div className={classnames('flex gap-1 items-center', _className)}>
            <div>Dashboard</div>
          </div>
        </Link>
      </li>
      <li>
        <Link on={on} to={URL.DOCUMENTATION}>
          <div className={classnames('flex gap-1 items-center', _className)}>
            <div>Documentation</div>
            <BiLinkExternal />
          </div>
        </Link>
      </li>
      <li>
        <Link on={on} to={URL.BLOG}>
          <div className={classnames('flex gap-1 items-center', _className)}>
            <div>Blog</div>
            <BiLinkExternal />
          </div>
        </Link>
      </li>
      <li>
        <Link on={on} to={URL.RELEASE_NOTES}>
          <div className={classnames('flex gap-1 items-center', _className)}>
            <div>Release Notes</div>
            <BiLinkExternal />
          </div>
        </Link>
      </li>
      <li>
        <Link on={on} to={URL.HELP}>
          <div className={classnames('flex gap-1 items-center', _className)}>
            <div>Help</div>
            <BiLinkExternal />
          </div>
        </Link>
      </li>
    </ul>
  );
};
export default Links;
