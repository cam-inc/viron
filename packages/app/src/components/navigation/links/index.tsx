import React from 'react';
import Link from '$components/link';
import { On, URL } from '$constants/index';

type Props = {
  on: On;
};
const Links: React.FC<Props> = ({ on }) => {
  return (
    <ul className="flex flex-col items-center text-xs">
      <li className="mb-2 last:mb-0">
        <Link on={on} to={URL.DOCUMENTATION}>
          Documentation
        </Link>
      </li>
      <li className="mb-2 last:mb-0">
        <Link on={on} to={URL.BLOG}>
          Blog
        </Link>
      </li>
      <li className="mb-2 last:mb-0">
        <Link on={on} to={URL.RELEASE_NOTES}>
          Release Notes
        </Link>
      </li>
      <li className="mb-2 last:mb-0">
        <Link on={on} to={URL.HELP}>
          Help
        </Link>
      </li>
      <li className="mb-2 last:mb-0">
        <Link on={on} to={URL.TERMS_OF_USE}>
          Terms of Use
        </Link>
      </li>
      <li className="mb-2 last:mb-0">
        <Link on={on} to={URL.PRIVACY_POLICY}>
          Privacy Policy
        </Link>
      </li>
    </ul>
  );
};
export default Links;
