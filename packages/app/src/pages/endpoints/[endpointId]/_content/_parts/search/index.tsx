import { AiOutlineSearch } from '@react-icons/all-files/ai/AiOutlineSearch';
import React, { useCallback } from 'react';
import Button from '$components/button';
import Drawer, { useDrawer } from '$components/drawer';
import Popover, { usePopover } from '$components/popover';
import RequestComponent from '$components/request';
import { ON } from '$constants/index';
import { Endpoint } from '$types/index';
import { Document, RequestValue } from '$types/oas';
import { UseBaseReturn } from '../../_hooks/useBase';

type Props = {
  endpoint: Endpoint;
  document: Document;
  base: UseBaseReturn;
};
const Search: React.FC<Props> = ({ endpoint, document, base }) => {
  const drawer = useDrawer();
  const handleButtonClick = function () {
    drawer.open();
  };

  const handleRequestSubmit = function (requestValue: RequestValue) {
    drawer.close();
    base.fetch(requestValue);
  };

  const popover = usePopover<HTMLDivElement>();
  const handleMouseEnter = useCallback(
    function () {
      popover.open();
    },
    [popover]
  );
  const handleMouseLeave = useCallback(
    function () {
      popover.close();
    },
    [popover]
  );

  return (
    <>
      <div
        ref={popover.targetRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Button
          on={ON.SURFACE}
          variant="text"
          Icon={AiOutlineSearch}
          onClick={handleButtonClick}
        />
      </div>
      <Drawer {...drawer.bind}>
        <RequestComponent
          on={ON.SURFACE}
          endpoint={endpoint}
          document={document}
          request={base.request}
          defaultValues={base.requestValue}
          onSubmit={handleRequestSubmit}
          className="h-full"
        />
      </Drawer>
      <Popover {...popover.bind}>
        <div className="text-on-surface whitespace-nowrap">Search</div>
      </Popover>
    </>
  );
};
export default Search;
