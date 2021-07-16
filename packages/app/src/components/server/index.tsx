import classnames from 'classnames';
import React from 'react';
import CommonMark from '$components/commonMark';
import { On, ON } from '$constants/index';
import { ClassName } from '$types/index';
import { Server } from '$types/oas';

type Props = {
  on: On;
  server: Server;
  className?: ClassName;
};
const _Server: React.FC<Props> = ({ on, server, className = '' }) => {
  return (
    <div
      className={classnames('py-1 p-2 text-xxs rounded', className, {
        'bg-on-background-faint text-on-background': on === ON.BACKGROUND,
        'bg-on-surface-faint text-on-surface': on === ON.SURFACE,
        'bg-on-primary-faint text-on-primary': on === ON.PRIMARY,
        'bg-on-complementary-faint text-on-complementary':
          on === ON.COMPLEMENTARY,
      })}
    >
      <div>{server.url}</div>
      {server.description && <CommonMark on={on} data={server.description} />}
    </div>
  );
};
export default _Server;
