import classnames from 'classnames';
import React from 'react';
import CommonMark from '$components/commonMark';
import { ON, On } from '$constants/index';
import { ClassName } from '$types/index';
import { ExternalDocumentation } from '$types/oas';

type Props = {
  on: On;
  data: ExternalDocumentation;
  className?: ClassName;
};
// TODO
const ExternalDocs: React.FC<Props> = ({ on, data, className = '' }) => {
  return (
    <div
      className={classnames('text-xxs', className, {
        'text-on-background': on === ON.BACKGROUND,
        'text-on-surface': on === ON.SURFACE,
        'text-on-primary': on === ON.PRIMARY,
        'text-on-complementary': on === ON.COMPLEMENTARY,
      })}
    >
      <div>{data.url}</div>
      {data.description && <CommonMark on={on} data={data.description} />}
    </div>
  );
};
export default ExternalDocs;
