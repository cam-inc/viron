import React from 'react';
import { useSetRecoilState } from 'recoil';
import { listState as endpointListState } from '$store/atoms/endpoint';
import { Endpoint } from '$types/index';

type Props = {};
const Add: React.FC<Props> = () => {
  const setEndpointList = useSetRecoilState(endpointListState);
  const handleAddClick = function () {
    setEndpointList(function (currVal) {
      const endpoint: Endpoint = {
        id: `${Math.random()}`,
        url: 'http://localhost:8000/',
      };
      return [...currVal, endpoint];
    });
  };

  return (
    <div>
      <button onClick={handleAddClick}>Add</button>
    </div>
  );
};

export default Add;
