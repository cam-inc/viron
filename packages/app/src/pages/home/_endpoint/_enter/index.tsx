import { ImEnter } from '@react-icons/all-files/im/ImEnter';
import { navigate } from 'gatsby';
import React, { useCallback, useMemo } from 'react';
import { Endpoint } from '$types/index';

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
      return (
        <button
          className="p-2 rounded flex items-center bg-complementary text-on-complementary"
          onClick={handleClick}
        >
          <ImEnter className="mr-1" />
          <div className="text-xs">Enter</div>
        </button>
      );
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
