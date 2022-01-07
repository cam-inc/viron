import { navigate } from 'gatsby';
import React, { useCallback, useMemo } from 'react';
import { Endpoint } from '~/types';

type Props = {
  endpoint: Endpoint;
  isSigninRequired: boolean;
};
const Enter: React.FC<Props> = ({ endpoint, isSigninRequired }) => {
  const handleClick = useCallback(
    function () {
      navigate(`/endpoints/${endpoint.id}`);
    },
    [endpoint]
  );

  const elm = useMemo<JSX.Element>(
    function () {
      return <button onClick={handleClick}>enter</button>;
    },
    [handleClick]
  );

  if (!endpoint.isPrivate) {
    return elm;
  }

  if (isSigninRequired) {
    return null;
  }

  return elm;
};
export default Enter;
