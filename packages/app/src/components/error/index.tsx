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
      <div>code: {error.code}</div>
      <div>name: {error.name}</div>
      {error.message && <div>{error.message}</div>}
      {error instanceof NetworkError && (
        <div>
          <div>TODO: NetworkError</div>
        </div>
      )}
      {error instanceof HTTP401Error && (
        <div>
          <div>TODO: 認証が必要よ。</div>
          <div>
            <Link on={on} to="/home">
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
  );
};
export default Error;
