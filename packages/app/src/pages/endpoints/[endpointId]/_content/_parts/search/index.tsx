import { AiOutlineSearch } from '@react-icons/all-files/ai/AiOutlineSearch';
import React from 'react';
import Button from '$components/button';
import Drawer, { useDrawer } from '$components/drawer';
import RequestComponent from '$components/request';
import { ON } from '$constants/index';
import { Document, RequestValue } from '$types/oas';
import { UseBaseReturn } from '../../_hooks/useBase';

type Props = {
  document: Document;
  base: UseBaseReturn;
};
const Search: React.FC<Props> = ({ document, base }) => {
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
          on={ON.SURFACE}
          document={document}
          request={base.request}
          defaultValues={base.requestValue}
          onSubmit={handleRequestSubmit}
        />
      </Drawer>
    </>
  );
};
export default Search;
