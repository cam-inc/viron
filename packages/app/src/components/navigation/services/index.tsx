import { AiFillGithub } from '@react-icons/all-files/ai/AiFillGithub';
import { AiFillTwitterCircle } from '@react-icons/all-files/ai/AiFillTwitterCircle';
import React from 'react';
import Link from '$components/link';
import { On, URL } from '$constants/index';

type Props = {
  on: On;
};
const Services: React.FC<Props> = ({ on }) => {
  return (
    <ul className="flex justify-center text-2xl">
      <li className="mr-2 last:mr-0">
        <Link on={on} to={URL.GITHUB} className="block">
          <AiFillGithub />
        </Link>
      </li>
      <li className="mr-2 last:mr-0">
        <Link on={on} to={URL.TWITTER} className="block">
          <AiFillTwitterCircle />
        </Link>
      </li>
    </ul>
  );
};
export default Services;
