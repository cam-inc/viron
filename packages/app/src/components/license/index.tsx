import classnames from 'classnames';
import React from 'react';
import { Props as BaseProps } from '~/components';
import AcademicCapIcon from '~/components/icon/academicCap/outline';
import Link from '~/components/link';
import { License } from '~/types/oas';
type Props = BaseProps & {
  data: License;
};

const _License: React.FC<Props> = ({ on, className = '', data }) => {
  if (data.url) {
    return (
      <Link
        className={classnames('group focus:outline-none', className)}
        on={on}
        to={data.url}
      >
        <div
          className={`flex gap-1 items-center text-xs text-thm-on-${on} group-hover:underline group-active:text-thm-on-${on}-low group-focus:ring-2 group-focus:ring-thm-on-${on}`}
        >
          <AcademicCapIcon className="w-em" />
          <div>{data.name}</div>
        </div>
      </Link>
    );
  }

  return (
    <div
      className={classnames(
        `flex gap-1 items-center text-xs text-thm-on-${on}`,
        className
      )}
    >
      <AcademicCapIcon className="w-em" />
      <div>{data.name}</div>
    </div>
  );
};
export default _License;
