import React from 'react';
import { useRecoilState } from 'recoil';
import { listState as endpointListState } from '$store/atoms/endpoint';
import { EndpointForDistribution } from '$types/index';

const Export: React.FC = () => {
  const [endpointList] = useRecoilState(endpointListState);

  const handleClick = function () {
    // Omit some data to minimize the json file size.
    const data: EndpointForDistribution[] = endpointList.map(function (
      endpoint
    ) {
      return {
        ...endpoint,
        authConfigs: null,
        document: null,
      };
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const blobURL = URL.createObjectURL(blob);
    const anchorElement = document.createElement('a');
    anchorElement.setAttribute('download', 'endpoints.json');
    anchorElement.href = blobURL;
    anchorElement.style.display = 'none';
    document.body.appendChild(anchorElement);
    anchorElement.click();
    // clean up.
    document.body.removeChild(anchorElement);
    URL.revokeObjectURL(blobURL);
  };

  return (
    <div>
      <button onClick={handleClick}>
        エンドポイント一覧をエクスポートする
      </button>
    </div>
  );
};
export default Export;
