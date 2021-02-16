import React from 'react';
import { useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import Textinput from '$components/textinput';
import { listState as endpointListState } from '$store/atoms/endpoint';
import { Endpoint } from '$types/index';

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

  const { register, handleSubmit, watch, errors } = useForm<{
    id: string;
    url: string;
  }>();
  const _handleSubmit = handleSubmit(function (data) {
    console.log(data);
    handleAddClick();
  });
  console.log(watch());

  return (
    <div>
      <form onSubmit={_handleSubmit}>
        <input
          name="id"
          defaultValue="test"
          ref={register({ required: true })}
        />
        <Textinput
          render={function () {
            return (
              <input
                name="url"
                defaultValue="test"
                ref={register({ required: true })}
              />
            );
          }}
        />
        {errors.id && <span>idエラー</span>}
        {errors.url && <span>urlエラー</span>}
        <input type="submit" />
      </form>
    </div>
  );
};

export default Add;
