import { BiError } from '@react-icons/all-files/bi/BiError';
import classnames from 'classnames';
import React, { useEffect } from 'react';
import { On, ON } from '$constants/index';
import Link from '$components/link';
import {
  BaseError,
  HTTP401Error,
  HTTP403Error,
  NetworkError,
} from '$errors/index';
import { error as logError, NAMESPACE } from '$utils/logger/index';

type Props = {
  on: On;
  error: BaseError;
};
const Error: React.FC<Props> = ({ on, error }) => {
  useEffect(
    function () {
      logError({
        messages: [error],
        // TODO: namespaceを変えること。
        namespace: NAMESPACE.REACT_COMPONENT,
      });
    },
    [error]
  );

  return (
    <div
      className={classnames('text-xs', {
        'text-on-background': on === ON.BACKGROUND,
        'text-on-surface': on === ON.SURFACE,
        'text-on-primary': on === ON.PRIMARY,
        'text-on-complementary': on === ON.COMPLEMENTARY,
      })}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="flex-none">
            <BiError className="text-2xl" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-bold">{error.name}</div>
            <div
              className={classnames('text-xxs', {
                'text-on-background-low': on === ON.BACKGROUND,
                'text-on-surface-low': on === ON.SURFACE,
                'text-on-primary-low': on === ON.PRIMARY,
                'text-on-complementary-low': on === ON.COMPLEMENTARY,
              })}
            >
              [{error.code}]
            </div>
          </div>
        </div>
        <div className="text-xs">{error.message}</div>
        {error instanceof NetworkError && (
          <div>
            <div>TODO: NetworkError</div>
          </div>
        )}
        {error instanceof HTTP401Error && (
          <div>
            <div>TODO: 認証が必要よ。</div>
            <div>
              <Link on={on} to="/dashboard">
                home
              </Link>
            </div>
          </div>
        )}
        {error instanceof HTTP403Error && (
          <div>
            <div>TODO: コンテンツへのアクセス権がないよ。</div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Error;
