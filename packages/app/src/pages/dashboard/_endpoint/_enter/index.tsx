import { ImEnter } from '@react-icons/all-files/im/ImEnter';
import { navigate } from 'gatsby';
import React, { useCallback, useMemo } from 'react';
import Button from '$components/button';
import { ON } from '$constants/index';
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
        <Button
          on={ON.SURFACE}
          Icon={ImEnter}
          label="Enter"
          size="xs"
          onClick={handleClick}
        />
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
