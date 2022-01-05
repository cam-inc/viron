import classnames from 'classnames';
import React from 'react';
import { On } from '$constants/index';
import { ClassName } from '$types/index';
import { CommonMark as CommonMarkType } from '$types/oas';

type Props = {
  on: On;
  data: CommonMarkType;
  className?: ClassName;
};
// TODO
const CommonMark: React.FC<Props> = ({ on, data, className = '' }) => (
  <div className={classnames('text-xxs', `text-on-${on}`, className)}>
    {data}
  </div>
);
export default CommonMark;
