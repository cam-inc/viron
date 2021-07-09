import { AiOutlineSearch } from '@react-icons/all-files/ai/AiOutlineSearch';
import React from 'react';
import Button from '$components/button';
import Drawer, { useDrawer } from '$components/drawer';
import RequestComponent from '$components/request';
import { ON } from '$constants/index';
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
    drawer.close();
    base.fetch(requestValue);
  };

  return (
    <>
      <Button
        on={ON.SURFACE}
        variant="text"
        Icon={AiOutlineSearch}
        onClick={handleClick}
      />
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
