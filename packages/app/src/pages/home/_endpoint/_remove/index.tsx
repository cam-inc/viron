import { AiFillDelete } from '@react-icons/all-files/ai/AiFillDelete';
import React, { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import Button from '$components/button';
import { listState } from '$store/atoms/endpoint';
import { Endpoint } from '$types/index';

type Props = {
  endpoint: Endpoint;
};
const Remove: React.FC<Props> = ({ endpoint }) => {
  const setEndpoints = useSetRecoilState(listState);

  const handleClick = useCallback(
    function () {
      setEndpoints(function (currVal) {
        return currVal.filter(function (_endpoint) {
          return _endpoint.id !== endpoint.id;
        });
      });
    },
    [endpoint, setEndpoints]
  );

  return (
    <Button
      on="surface"
      variant="text"
      Icon={AiFillDelete}
      onClick={handleClick}
    />
  );
};
export default Remove;
