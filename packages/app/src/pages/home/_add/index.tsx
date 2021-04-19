import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import * as yup from 'yup';
import Textinput from '$components/textinput';
import { listState as endpointListState } from '$store/atoms/endpoint';
import { AuthType, Endpoint, EndpointID, URL as TypeURL } from '$types/index';
import { Document } from '$types/oas';
import { isOASSupported, promiseErrorHandler } from '$utils/index';
import { endpointId, url } from '$utils/v8n';

type Props = {
  className?: string;
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

  const {
    register,
    handleSubmit,
    formState,
    setError,
    reset,
  } = useForm<FormData>({
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
      if (!!responseError) {
        // Network error.
        setError('url', {
          type: 'manual',
          message: responseError.message,
        });
        return;
      }

      // The response.ok being true means the response.status is 2xx.
      // The endpoint exists and it's open to public.
      if (response.ok) {
        const document: Document = await response.json();
        const { isValid } = isOASSupported(document);
        if (isValid) {
          setEndpointList(function (currVal) {
            const endpoint: Endpoint = {
              id: data.endpointId,
              url: data.url,
              isPrivate: false,
              authTypes: [],
              token: null,
              document,
            };
            return [...currVal, endpoint];
          });
          reset();
        } else {
          setError('url', {
            type: 'manual',
            message: 'The OAS Document is not of version we support.',
          });
        }
        return;
      }

      // The OAS document requires authentication.
      // The endpoint exists and it's not open to public.
      if (!response.ok && response.status === 401) {
        const [response, responseError] = await promiseErrorHandler(
          fetch(`${new URL(data.url).origin}/viron_authtype`, {
            mode: 'cors',
          })
        );
        if (!!responseError) {
          // Network error.
          // TODO: show error.
          return;
        }
        const authTypes: AuthType[] = await response.json();
        setEndpointList(function (currVal) {
          const endpoint: Endpoint = {
            id: data.endpointId,
            url: data.url,
            isPrivate: true,
            authTypes,
            token: null,
            document: null,
          };
          return [...currVal, endpoint];
        });
        reset();
        return;
      }

      // The endpoint doesn't exist.
      // TODO: show error.
      return;
    },
    [endpointList, setEndpointList, reset, setError]
  );

  return (
    <div>
      <form onSubmit={handleSubmit(addEndpoint)}>
        <Textinput
          label="Endpoint Id"
          error={formState.errors.endpointId}
          render={function (
            className
          ): React.ReactElement<JSX.IntrinsicElements['input'], 'input'> {
            return (
              <input
                className={className}
                defaultValue=""
                {...register('endpointId')}
              />
            );
          }}
        />
        <Textinput
          label="URL"
          error={formState.errors.url}
          render={function (
            className
          ): React.ReactElement<JSX.IntrinsicElements['input'], 'input'> {
            return (
              <input
                className={className}
                defaultValue=""
                {...register('url')}
              />
            );
          }}
        />
        <input type="submit" />
      </form>
    </div>
  );
};

export default Add;
