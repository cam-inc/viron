import { AiOutlineSearch } from '@react-icons/all-files/ai/AiOutlineSearch';
import React from 'react';
import Drawer, { useDrawer } from '$components/drawer';
import RequestComponent from '$components/request';
import { RequestValue } from '$types/oas';
import { UseBaseReturn } from '../../_hooks/useBase';

type Props = {
  base: UseBaseReturn;
};
const Search: React.FC<Props> = ({ base }) => {
  const drawer = useDrawer();
  const handleClick = function () {
    drawer.open();
  };
  const handleRequestSubmit = function (requestValue: RequestValue) {
    drawer.requestClose();
    base.fetch(requestValue);
  };

  return (
    <>
      <button onClick={handleClick}>
        <AiOutlineSearch className="inline" />
        <span>search</span>
      </button>
      <Drawer {...drawer.bind}>
        <RequestComponent
          request={base.request}
          defaultValues={base.requestValue}
          onSubmit={handleRequestSubmit}
        />
      </Drawer>
    </>
  );
};
export default Search;
