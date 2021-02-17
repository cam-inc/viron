import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import * as yup from 'yup';
import Textinput from '$components/textinput';
import { listState as endpointListState } from '$store/atoms/endpoint';
import { Endpoint, EndpointID, URL } from '$types/index';
import { endpointId, url } from '$utils/v8n';

type Props = {};
const Add: React.FC<Props> = () => {
  const schema = useMemo(function () {
    return yup.object().shape({
      endpointId: endpointId.required(),
      url: url.required(),
    });
  }, []);

  type FormData = {
    endpointId: EndpointID;
    url: URL;
  };
  const { register, handleSubmit, errors, setError, reset } = useForm<FormData>(
    {
      resolver: yupResolver(schema),
    }
  );

  const [endpointList, setEndpointList] = useRecoilState(endpointListState);
  const addEndpoint = useCallback(
    function (data: FormData) {
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
      // Add an endpoint and reset the form.
      setEndpointList(function (currVal) {
        const endpoint: Endpoint = {
          id: data.endpointId,
          url: data.url,
          ping: false,
        };
        return [...currVal, endpoint];
      });
      reset();
    },
    [endpointList, setEndpointList, reset, setError]
  );

  return (
    <div>
      <form onSubmit={handleSubmit(addEndpoint)}>
        <Textinput
          label="Endpoint Id"
          error={errors.endpointId}
          render={function (
            className
          ): React.ReactElement<JSX.IntrinsicElements['input'], 'input'> {
            return (
              <input
                className={className}
                name="endpointId"
                defaultValue=""
                ref={register}
              />
            );
          }}
        />
        <Textinput
          label="URL"
          error={errors.url}
          render={function (
            className
          ): React.ReactElement<JSX.IntrinsicElements['input'], 'input'> {
            return (
              <input
                className={className}
                name="url"
                defaultValue=""
                ref={register}
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
