import { yupResolver } from '@hookform/resolvers/yup';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import * as yup from 'yup';
import Textinput from '$components/textinput';
import { listState as endpointListState } from '$store/atoms/endpoint';
import { Endpoint, EndpointID, URL } from '$types/index';
import { endpointId, url } from '$utils/v8n';

type Props = {};
const Add: React.FC<Props> = () => {
  const setEndpointList = useSetRecoilState(endpointListState);
  const handleAddClick = function (): void {
    setEndpointList(function (currVal) {
      const endpoint: Endpoint = {
        id: `${Math.random()}`,
        url: 'http://localhost:8000/',
      };
      return [...currVal, endpoint];
    });
  };

  const schema = useMemo(function () {
    return yup.object().shape({
      endpointId: endpointId.required(),
      url: url.required(),
    });
  }, []);
  const { register, handleSubmit, errors } = useForm<{
    endpointId: EndpointID;
    url: URL;
  }>({
    resolver: yupResolver(schema),
  });
  const _handleSubmit = handleSubmit(function (data) {
    console.log(data);
    handleAddClick();
  });

  return (
    <div>
      <form onSubmit={_handleSubmit}>
        <Textinput
          error={errors.endpointId}
          render={function () {
            return <input name="url" defaultValue="" ref={register} />;
          }}
        />
        <Textinput
          error={errors.url}
          render={function () {
            return <input name="url" defaultValue="" ref={register} />;
          }}
        />
        <input type="submit" />
      </form>
    </div>
  );
};

export default Add;
