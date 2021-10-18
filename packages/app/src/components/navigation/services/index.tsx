import { AiFillGithub } from '@react-icons/all-files/ai/AiFillGithub';
import { AiFillTwitterCircle } from '@react-icons/all-files/ai/AiFillTwitterCircle';
import classnames from 'classnames';
import React from 'react';
import Link from '$components/link';
import { On, URL } from '$constants/index';

type Props = {
  on: On;
};
const Services: React.FC<Props> = ({ on }) => {
  const _className = classnames(
    'focus:outline-none focus:ring-2',
    `text-on-${on} hover:text-on-${on}-high focus:ring-on-${on} focus:text-on-${on}-high active:text-on-${on}-high`
  );

  return (
    <ul className="flex justify-center text-2xl">
      <li className="mr-2 last:mr-0">
        <Link on={on} to={URL.GITHUB} className="block">
          <div className={_className}>
            <AiFillGithub />
          </div>
        </Link>
      </li>
      <li className="mr-2 last:mr-0">
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
