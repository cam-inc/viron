import { BiLinkExternal } from '@react-icons/all-files/bi/BiLinkExternal';
import classnames from 'classnames';
import React from 'react';
import Link from '$components/link';
import { On, ON, URL } from '$constants/index';

type Props = {
  on: On;
};
const Links: React.FC<Props> = ({ on }) => {
  const _className = classnames(
    'hover:underline focus:outline-none focus:ring-2',
    {
      'text-on-background focus:ring-on-background active:text-on-background-high':
        on === ON.BACKGROUND,
      'text-on-surface focus:ring-on-surface active:text-on-surface-high':
        on === ON.SURFACE,
      'text-on-primary focus:ring-on-primary active:text-on-primary-high':
        on === ON.PRIMARY,
      'text-on-complementary focus:ring-on-complementary active:text-on-complementary-high':
        on === ON.COMPLEMENTARY,
    }
  );

  return (
    <ul className="flex flex-col items-center text-xs">
      <li className="mb-2 last:mb-0">
        <Link on={on} to={URL.DOCUMENTATION}>
          <div className={classnames('flex gap-1 items-center', _className)}>
            <div>Documentation</div>
            <BiLinkExternal />
          </div>
        </Link>
      </li>
      <li className="mb-2 last:mb-0">
        <Link on={on} to={URL.BLOG}>
          <div className={classnames('flex gap-1 items-center', _className)}>
            <div>Blog</div>
            <BiLinkExternal />
          </div>
        </Link>
      </li>
      <li className="mb-2 last:mb-0">
        <Link on={on} to={URL.RELEASE_NOTES}>
          <div className={classnames('flex gap-1 items-center', _className)}>
            <div>Release Notes</div>
            <BiLinkExternal />
          </div>
        </Link>
      </li>
      <li className="mb-2 last:mb-0">
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
