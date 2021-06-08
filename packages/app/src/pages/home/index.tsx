import { PageProps } from 'gatsby';
import React from 'react';
import { useRecoilState } from 'recoil';
import useTheme from '$hooks/theme';
import { listState as endpointListState } from '$store/atoms/endpoint';
import { Endpoint as EndpointType } from '$types/index';
import Add from './_add/index';
import Endpoint from './_endpoint';

type Props = PageProps;
const HomePage: React.FC<Props> = () => {
  useTheme();
  const [endpointList, setEndpointList] = useRecoilState(endpointListState);

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

  const handleImportClick = function () {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    const handleFileChange = function () {
      if (!inputElement.files || !inputElement.files.length) {
        return;
      }
      const file = inputElement.files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function () {
        if (typeof reader.result !== 'string') {
          throw new Error('TODO');
        }
        try {
          const endpointList: EndpointType[] = JSON.parse(reader.result);
          endpointList.forEach(function (endpoint) {
            setEndpointList(function (currVal) {
              let { id } = endpoint;
              if (
                !!currVal.find(function (endpoint) {
                  return endpoint.id === id;
                })
              ) {
                id = `${id}-${Math.random()}`;
              }
              return [
                ...currVal,
                {
                  ...endpoint,
                  id,
                },
              ];
            });
          });
          inputElement.removeEventListener('change', handleFileChange);
          document.body.removeChild(inputElement);
        } catch {
          throw new Error('TODO');
        }
        reader.result;
      };
      reader.onerror = function () {
        throw new Error((reader.error as DOMException).message);
      };
    };
    inputElement.addEventListener('change', handleFileChange);
    document.body.appendChild(inputElement);
    inputElement.click();
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
      <button onClick={handleImportClick}>
        エンドポイント一覧をインポートする
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
