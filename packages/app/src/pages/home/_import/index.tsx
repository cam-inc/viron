import React from 'react';
import { useRecoilState } from 'recoil';
import { listState as endpointListState } from '$store/atoms/endpoint';
import { AuthConfig, Endpoint, EndpointForDistribution } from '$types/index';
import { promiseErrorHandler } from '$utils/index';
import { lint, resolve } from '$utils/oas';

const Import: React.FC = () => {
  const [, setEndpointList] = useRecoilState(endpointListState);

  const handleClick = function () {
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
        let endpointList: EndpointForDistribution[] = [];
        try {
          endpointList = JSON.parse(reader.result);
        } catch {
          throw new Error('TODO');
        }
        // TODO: 良い感じにsrc/pages/home/_add/index.tsxと処理を統一したい。
        Promise.all(
          endpointList.map<Promise<void>>(function (endpoint): Promise<void> {
            const f = async function () {
              // Check whether the endpoint exists or not.
              const [response, responseError] = await promiseErrorHandler(
                fetch(endpoint.url, {
                  mode: 'cors',
                })
              );
              if (!!responseError) {
                // 稀なケース。エクスポート後にエンドポイントurlを変更した際などに。
                // TODO: show error.
                return;
              }
              if (response.ok) {
                const document: Record<string, any> = await response.json();
                const { isValid } = lint(document);
                if (!isValid) {
                  // TODO: show error
                  console.error(
                    'The OAS Document is not of version we support.'
                  );
                  return;
                }
                setEndpointList(function (currVal) {
                  // ID duplication check.
                  let { id } = endpoint;
                  if (
                    !!currVal.find(function (endpoint) {
                      return endpoint.id === id;
                    })
                  ) {
                    id = `${id}-${Math.random()}`;
                  }
                  const _endpoint: Endpoint = {
                    ...endpoint,
                    id,
                    isPrivate: false,
                    authConfigs: null,
                    document: resolve(document),
                  };
                  return [...currVal, _endpoint];
                });
                return;
              }
              if (!response.ok && response.status === 401) {
                const authconfigsPath = response.headers.get(
                  'x-viron-authtypes-path'
                );
                // TODO: 値のundefinedチェックに加えて、値の妥当性もチェックすること。
                if (!authconfigsPath) {
                  // TODO: エラー表示。Viron仕様上、'x-viron-authtypes-path'レスポンスヘッダーは必須。
                  return;
                }
                const [authconfigsResponse, authconfigsResponseError] =
                  await promiseErrorHandler(
                    fetch(`${new URL(endpoint.url).origin}${authconfigsPath}`, {
                      mode: 'cors',
                    })
                  );
                if (!!authconfigsResponseError) {
                  // Network error.
                  // TODO: show error.
                  return;
                }
                // TODO: GET /authconfigsのレスポンスをフラットなAuthConfig[]に変更したい。
                const authConfigs: { list: AuthConfig[] } =
                  await authconfigsResponse.json();
                // TODO: authConfigs.list値の妥当性をチェックする。
                setEndpointList(function (currVal) {
                  // ID duplication check.
                  let { id } = endpoint;
                  if (
                    !!currVal.find(function (endpoint) {
                      return endpoint.id === id;
                    })
                  ) {
                    id = `${id}-${Math.random()}`;
                  }
                  const _endpoint: Endpoint = {
                    ...endpoint,
                    id,
                    isPrivate: true,
                    authConfigs: authConfigs.list,
                    document: null,
                  };
                  return [...currVal, _endpoint];
                });
                return;
              }
              // Something went wrong.
              // response.ok is false and response.status is other than 401.
              // TODO: show error.
            };
            return f();
          })
        )
          .then(function () {
            inputElement.removeEventListener('change', handleFileChange);
            document.body.removeChild(inputElement);
          })
          .catch(function (error) {
            // TODO
            console.error(error);
          });
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
    <div>
      <button onClick={handleClick}>エンドポイント一覧をインポートする</button>
    </div>
  );
};
export default Import;
