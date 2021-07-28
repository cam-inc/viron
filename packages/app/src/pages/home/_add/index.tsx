import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import * as yup from 'yup';
import Button from '$components/button';
import Textinput from '$components/textinput';
import { ON, STATUS_CODE } from '$constants/index';
import { HTTPUnexpectedError } from '$errors/index';
import { listState as endpointListState } from '$store/atoms/endpoint';
import {
  AuthConfig,
  ClassName,
  Endpoint,
  EndpointID,
  URL as TypeURL,
} from '$types/index';
import { promiseErrorHandler } from '$utils/index';
import { lint, resolve } from '$utils/oas';
import { endpointId, url } from '$utils/v8n';

type Props = {
  className?: ClassName;
};
type FormData = {
  endpointId: EndpointID;
  url: TypeURL;
};
const Add: React.FC<Props> = () => {
  const schema = useMemo(function () {
    return yup.object().shape({
      endpointId: endpointId.required(),
      url: url.required(),
    });
  }, []);
  const { register, handleSubmit, formState, setError, reset } =
    useForm<FormData>({
      resolver: yupResolver(schema),
    });
  const [endpointList, setEndpointList] = useRecoilState(endpointListState);

  const addEndpoint = useCallback(
    async function (data: FormData): Promise<void> {
      // Duplication check.
      if (
        !!endpointList.find(function (endpoind) {
          return endpoind.id === data.endpointId;
        })
      ) {
        setError('endpointId', {
          type: 'manual',
          message: 'Endpoint ID duplicated.',
        });
        return;
      }

      // Check whether the endpoint exists or not.
      const [response, responseError] = await promiseErrorHandler(
        fetch(data.url, {
          mode: 'cors',
        })
      );
      if (responseError) {
        // Network error.
        setError('url', {
          type: 'manual',
          message: responseError.message,
        });
        return;
      }

      // The response.ok being true means that the response.status is 2xx.
      // The endpoint exists and it's open to public.
      if (response.ok) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const document: Record<string, any> = await response.json();
        const { isValid } = lint(document);
        if (!isValid) {
          setError('url', {
            type: 'manual',
            message: 'The OAS Document is not of version we support.',
          });
          return;
        }
        setEndpointList(function (currVal) {
          const endpoint: Endpoint = {
            id: data.endpointId,
            url: data.url,
            isPrivate: false,
            authConfigs: null,
            document: resolve(document),
          };
          return [...currVal, endpoint];
        });
        // Clear errors and input data.
        reset();
        return;
      }

      // The OAS document requires authentication.
      // The endpoint exists and it's not open to public.
      if (!response.ok && response.status === STATUS_CODE.UNAUTHORIZED) {
        const authconfigsPath = response.headers.get('x-viron-authtypes-path');
        // TODO: 値のundefinedチェックに加えて、値の妥当性もチェックすること。
        if (!authconfigsPath) {
          setError('url', {
            type: 'manual',
            message: 'The x-viron-authtypes-path response header is missing.',
          });
          return;
        }
        const [authconfigsResponse, authconfigsResponseError] =
          await promiseErrorHandler(
            fetch(`${new URL(data.url).origin}${authconfigsPath}`, {
              mode: 'cors',
            })
          );
        if (!!authconfigsResponseError) {
          // Network error.
          setError('url', {
            type: 'manual',
            message: `Couldn't establish a connection to ${
              new URL(data.url).origin
            }${authconfigsPath}.`,
          });
          return;
        }
        // TODO: GET /authconfigsのレスポンスをフラットなAuthConfig[]に変更したい。
        const authConfigs: { list: AuthConfig[] } =
          await authconfigsResponse.json();
        // TODO: authConfigs.list値の妥当性をチェックする。
        setEndpointList(function (currVal) {
          const endpoint: Endpoint = {
            id: data.endpointId,
            url: data.url,
            isPrivate: true,
            authConfigs: authConfigs.list,
            document: null,
          };
          return [...currVal, endpoint];
        });
        reset();
        return;
      }

      // Something went wrong.
      // response.ok is false and response.status is other than 401.
      const error = new HTTPUnexpectedError();
      setError('url', {
        type: 'manual',
        message: error.message,
      });
      return;
    },
    [endpointList, setEndpointList, reset, setError]
  );

  return (
    <div className="p-2">
      <form onSubmit={handleSubmit(addEndpoint)}>
        <Textinput
          className="mb-2 last:mb-0"
          label="Endpoint Id"
          error={formState.errors.endpointId}
          render={function (bind) {
            return (
              <input defaultValue="" {...bind} {...register('endpointId')} />
            );
          }}
        />
        <Textinput
          className="mb-2 last:mb-0"
          label="URL"
          error={formState.errors.url}
          render={function (bind) {
            return <input defaultValue="" {...bind} {...register('url')} />;
          }}
        />
        <Button on={ON.SURFACE} size="xs" type="submit" label="Add" />
      </form>
    </div>
  );
};

export default Add;
