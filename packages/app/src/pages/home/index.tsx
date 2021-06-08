import { PageProps } from 'gatsby';
import React from 'react';
import { useRecoilValue } from 'recoil';
import useTheme from '$hooks/theme';
import { listState as endpointListState } from '$store/atoms/endpoint';
import { Endpoint as EndpointType } from '$types/index';
import Add from './_add/index';
import Endpoint from './_endpoint';

type Props = PageProps;
const HomePage: React.FC<Props> = () => {
  useTheme();
  const endpointList = useRecoilValue(endpointListState);

  const handleExportClick = function () {
    const data: EndpointType[] = [];
    endpointList.forEach(function (endpoint) {
      data.push({
        ...endpoint,
        document: null,
      });
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
    <div id="page-home">
      <div>
        <p>ThemeとDarkModeのテスト</p>
        <p className="bg-primary-l dark:bg-primary-d">color-primary</p>
        <p className="bg-secondary-l dark:bg-secondary-d">color-secondary</p>
        <p className="bg-tertiary-l dark:bg-tertiary-d">color-tertiary</p>
      </div>
      <button onClick={handleExportClick}>
        エンドポイント一覧をエクスポートする
      </button>
      <ul>
        {endpointList.map(function (endpoint) {
          return (
            <React.Fragment key={endpoint.id}>
              <li className="mb-1 last:mb-0">
                <Endpoint id={endpoint.id} />
              </li>
            </React.Fragment>
          );
        })}
      </ul>
      <Add />
    </div>
  );
};

export default HomePage;
