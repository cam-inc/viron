import classnames from 'classnames';
import React from 'react';
import { Props as BaseProps } from '~/components';
import ChevronRightIcon from '~/components/icon/chevronRight/outline';

export type Props = BaseProps & {
  list: string[];
};
const Breadcrumb: React.FC<Props> = ({ on, list, className = '' }) => {
  return (
    <div className={classnames(`text-thm-on-${on}`, className)}>
      <div className="flex items-center gap-1">
        {list.map((label) => (
          <React.Fragment key={label}>
            <div className="">{label}</div>
            <div className="">
              <ChevronRightIcon className="w-em" />
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
export default Breadcrumb;
