import React from 'react';
import { BaseError, HTTP401Error, HTTP403Error } from '$errors/index';

type Props = {
  error: BaseError;
};
const Error: React.FC<Props> = ({ error }) => {
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
