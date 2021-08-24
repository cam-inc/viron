import { BiChevronRight } from '@react-icons/all-files/bi/BiChevronRight';
import classnames from 'classnames';
import React from 'react';
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
      className={classnames('', className, {
        'text-on-background': on === ON.BACKGROUND,
        'text-on-surface': on === ON.SURFACE,
        'text-on-primary': on === ON.PRIMARY,
        'text-on-complementary': on === ON.COMPLEMENTARY,
      })}
    >
      <div className="flex items-center gap-1">
        {list.map(function (label) {
          return (
            <React.Fragment key={label}>
              <div className="">{label}</div>
              <div className="">
                <BiChevronRight />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
export default Breadcrumb;
