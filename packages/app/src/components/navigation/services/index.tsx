import { AiFillGithub } from '@react-icons/all-files/ai/AiFillGithub';
import { AiFillTwitterCircle } from '@react-icons/all-files/ai/AiFillTwitterCircle';
import classnames from 'classnames';
import React from 'react';
import Link from '$components/link';
import { On, ON, URL } from '$constants/index';

type Props = {
  on: On;
};
const Services: React.FC<Props> = ({ on }) => {
  const _className = classnames('focus:outline-none focus:ring-2', {
    'text-on-background hover:text-on-background-high focus:ring-on-background focus:text-on-background-high active:text-on-background-high':
      on === ON.BACKGROUND,
    'text-on-surface hover:text-on-surface-high focus:ring-on-surface focus:text-on-surface-high active:text-on-surface-high':
      on === ON.SURFACE,
    'text-on-primary hover:text-on-primary-high focus:ring-on-primary focus:text-on-primary-high active:text-on-primary-high':
      on === ON.PRIMARY,
    'text-on-complementary hover:text-on-complementary-high focus:ring-on-complementary focus:text-on-complementary-high active:text-on-complementary-high':
      on === ON.COMPLEMENTARY,
  });

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
