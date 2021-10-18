import { BiChevronRight } from '@react-icons/all-files/bi/BiChevronRight';
import classnames from 'classnames';
import React from 'react';
import { On } from '$constants/index';
import { ClassName } from '$types/index';

export type Props = {
  on: On;
  list: string[];
  className?: ClassName;
};
const Breadcrumb: React.FC<Props> = ({ on, list, className = '' }) => {
  return (
    <div className={classnames('', `text-on-${on}`, className)}>
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
