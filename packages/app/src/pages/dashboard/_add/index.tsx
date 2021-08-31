import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames';
import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import * as yup from 'yup';
import Button from '$components/button';
import Textinput from '$components/textinput';
import { ON, HTTP_STATUS_CODE } from '$constants/index';
import { HTTPUnexpectedError } from '$errors/index';
import { listState as endpointListState } from '$store/atoms/endpoint';
import {
  AuthConfigsResponse,
  ClassName,
  Endpoint,
  EndpointID,
  URL as TypeURL,
} from '$types/index';
import { promiseErrorHandler } from '$utils/index';
import { lint, resolve } from '$utils/oas';
import { endpointId, url } from '$utils/v8n';

export type Props = {
  className?: ClassName;
  onAdd: () => void;
};
type FormData = {
  endpointId: EndpointID;
  url: TypeURL;
};
const Add: React.FC<Props> = ({ onAdd, className = '' }) => {
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
        onAdd();
        return;
      }

      // The OAS document requires authentication.
      // The endpoint exists and it's not open to public.
      if (!response.ok && response.status === HTTP_STATUS_CODE.UNAUTHORIZED) {
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
        const authConfigs: AuthConfigsResponse =
          await authconfigsResponse.json();
        // TODO: authConfigs値の妥当性をチェックする。
        setEndpointList(function (currVal) {
          const endpoint: Endpoint = {
            id: data.endpointId,
            url: data.url,
            isPrivate: true,
            authConfigs,
            document: null,
          };
          return [...currVal, endpoint];
        });
        reset();
        onAdd();
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
    [endpointList, setEndpointList, reset, setError, onAdd]
  );

  return (
    <div className={classnames('p-2', className)}>
      <form onSubmit={handleSubmit(addEndpoint)}>
        <Textinput
          on={ON.SURFACE}
          className="mb-2 last:mb-0"
          label="Endpoint Id"
          error={formState.errors.endpointId}
          render={function (bind) {
            return <input {...bind} {...register('endpointId')} />;
          }}
        />
        <Textinput
          on={ON.SURFACE}
          className="mb-2 last:mb-0"
          label="URL"
          error={formState.errors.url}
          render={function (bind) {
            return <input {...bind} {...register('url')} />;
          }}
        />
        <Button on={ON.SURFACE} size="xs" type="submit" label="Add" />
      </form>
    </div>
  );
};

export default Add;
