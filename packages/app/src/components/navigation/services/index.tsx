import { AiFillGithub } from '@react-icons/all-files/ai/AiFillGithub';
import { AiFillTwitterCircle } from '@react-icons/all-files/ai/AiFillTwitterCircle';
import classnames from 'classnames';
import React from 'react';

type Props = {
  className: string;
};
const Services: React.FC<Props> = ({ className }) => {
  return (
    <ul className={classnames('flex justify-center text-2xl', className)}>
      <li className="mr-2 last:mr-0">
        <AiFillGithub />
      </li>
      <li className="mr-2 last:mr-0">
        <AiFillTwitterCircle />
      </li>
    </ul>
  );
};
export default Services;
