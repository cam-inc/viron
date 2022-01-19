import { AiOutlineSearch } from '@react-icons/all-files/ai/AiOutlineSearch';
import React, { useCallback } from 'react';
import TextButton, { Props as TextButtonProps } from '~/components/button/text';
import Request from '~/components/request';
import Drawer, { useDrawer } from '~/portals/drawer';
import Popover, { usePopover } from '~/portals/popover';
import { COLOR_SYSTEM, Endpoint } from '~/types';
import { Document, RequestValue } from '~/types/oas';
import { UseBaseReturn } from '../../hooks/useBase';

export type Props = {
  endpoint: Endpoint;
  document: Document;
  base: UseBaseReturn;
};
const Search: React.FC<Props> = ({ endpoint, document, base }) => {
  const drawer = useDrawer();
  const handleButtonClick = useCallback<TextButtonProps['onClick']>(() => {
    drawer.open();
  }, [drawer]);

  const handleRequestSubmit = useCallback(
    (requestValue: RequestValue) => {
      drawer.close();
      base.fetch(requestValue);
    },
    [drawer, base]
  );

  const popover = usePopover<HTMLDivElement>();
  const handleMouseEnter = useCallback(() => {
    popover.open();
  }, [popover]);
  const handleMouseLeave = useCallback(() => {
    popover.close();
  }, [popover]);

  return (
    <>
      <div
        ref={popover.targetRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <TextButton
          cs={COLOR_SYSTEM.PRIMARY}
          Icon={AiOutlineSearch}
          onClick={handleButtonClick}
        />
      </div>
      <Drawer {...drawer.bind}>
        <Request
          on={COLOR_SYSTEM.SURFACE}
          endpoint={endpoint}
          document={document}
          request={base.request}
          defaultValues={base.requestValue}
          onSubmit={handleRequestSubmit}
          className="h-full"
        />
      </Drawer>
      <Popover {...popover.bind}>
        <div className="text-thm-on-surface whitespace-nowrap">Search</div>
      </Popover>
    </>
  );
};
export default Search;
