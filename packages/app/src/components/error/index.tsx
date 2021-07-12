import React, { useEffect } from 'react';
import { BaseError, HTTP401Error, HTTP403Error } from '$errors/index';
import { error as logError, NAMESPACE } from '$utils/logger/index';

type Props = {
  error: BaseError;
};
const Error: React.FC<Props> = ({ error }) => {
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
    <div>
      <div>code: {error.code}</div>
      <div>name: {error.name}</div>
      {error.message && <div>{error.message}</div>}
      {error instanceof HTTP401Error && <div>TODO: 認証が必要よ。</div>}
      {error instanceof HTTP403Error && (
        <div>TODO: コンテンツへのアクセス権がないよ。</div>
      )}
    </div>
  );
};
export default Error;
