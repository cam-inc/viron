import classnames from 'classnames';
import React from 'react';
import { Props as BaseProps } from '~/components';
import ChevronRightIcon from '~/components/icon/chevronRight/outline';

export type Props = BaseProps & {
  list: string[];
};
const Breadcrumb: React.FC<Props> = ({ on, list, className = '' }) => {
  return (
    <div
      className={classnames(
        `text-thm-on-${on} flex items-center gap-1`,
        className
      )}
    >
      {list.map((label) => (
        <React.Fragment key={label}>
          <p>{label}</p>

          <ChevronRightIcon className={`w-em text-thm-on-${on}-low`} />
        </React.Fragment>
      ))}
    </div>
  );
};
export default Breadcrumb;
