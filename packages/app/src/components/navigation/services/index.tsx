import { AiFillGithub } from '@react-icons/all-files/ai/AiFillGithub';
import { AiFillTwitterCircle } from '@react-icons/all-files/ai/AiFillTwitterCircle';
import React from 'react';
import Link from '$components/link';
import { On, URL } from '$constants/index';

type Props = {
  on: On;
};
const Services: React.FC<Props> = ({ on }) => {
  const _className = `text-thm-on-${on} hover:text-thm-on-${on}-high focus:outline-none focus:ring-2 focus:ring-thm-on-${on} focus:text-thm-on-${on}-high active:text-thm-on-${on}-high`;

  return (
    <ul className="flex justify-center gap-2 text-2xl">
      <li>
        <Link on={on} to={URL.GITHUB} className="block">
          <div className={_className}>
            <AiFillGithub />
          </div>
        </Link>
      </li>
      <li>
        <Link on={on} to={URL.TWITTER} className="block">
          <div className={_className}>
            <AiFillTwitterCircle />
          </div>
        </Link>
      </li>
    </ul>
  );
};
export default Services;
