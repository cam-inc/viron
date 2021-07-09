import { BiChevronRight } from '@react-icons/all-files/bi/BiChevronRight';
import { BiHomeSmile } from '@react-icons/all-files/bi/BiHomeSmile';
import classnames from 'classnames';
import React from 'react';
import Link from '$components/link';
import { ON, On } from '$constants/index';
import { ClassName } from '$types/index';

export type Props = {
  on: On;
  list: string[];
  className?: ClassName;
};
const Breadcrumb: React.FC<Props> = ({ on, list, className = '' }) => {
  return (
    <div
      className={classnames('text-xxs', className, {
        'text-on-background': on === ON.BACKGROUND,
        'text-on-surface': on === ON.SURFACE,
        'text-on-primary': on === ON.PRIMARY,
        'text-on-complementary': on === ON.COMPLEMENTARY,
      })}
    >
      <div className="flex items-center">
        <div className="mr-1 last:mr-0">
          <Link className="block" on={on} to="/home">
            <BiHomeSmile />
          </Link>
        </div>
        {list.map(function (label) {
          return (
            <React.Fragment key={label}>
              <div className="mr-1 last:mr-0">
                <BiChevronRight />
              </div>
              <div className="mr-1 last:mr-0">{label}</div>
            </React.Fragment>
          );
        })}
        <div className="mr-1 last:mr-0">
          <BiChevronRight />
        </div>
      </div>
    </div>
  );
};
export default Breadcrumb;
