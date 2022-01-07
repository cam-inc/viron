import React, { useCallback, useState } from 'react';
import RequestComponent from '~/components/request';
import { BaseError } from '~/errors/index';
import Drawer, { useDrawer } from '~/portals/drawer';
import { COLOR_SYSTEM, Endpoint } from '~/types';
import { Document, RequestValue } from '~/types/oas';
import Action from '../action';
import { UseSiblingsReturn } from '../../_hooks/useSiblings';

export type Props = {
  endpoint: Endpoint;
  document: Document;
  sibling: UseSiblingsReturn[number];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOperationSuccess: (data: any) => void;
  onOperationFail: (error: BaseError) => void;
};
const Sibling: React.FC<Props> = ({
  endpoint,
  document,
  sibling,
  onOperationSuccess,
  onOperationFail,
}) => {
  const [isPending, setIsPending] = useState<boolean>(false);

  const drawer = useDrawer();
  const handleClick = useCallback(
    function () {
      if (isPending) {
        return;
      }
      drawer.open();
    },
    [drawer, isPending]
  );

  const handleRequestSubmit = async function (requestValue: RequestValue) {
    drawer.close();
    setIsPending(true);
    const { data, error } = await sibling.fetch(requestValue);
    setIsPending(false);
    if (data) {
      onOperationSuccess(data);
    }
    if (error) {
      onOperationFail(error);
    }
  };

  return (
    <>
      <Action request={sibling.request} onClick={handleClick} />
      <Drawer {...drawer.bind}>
        <RequestComponent
          on={COLOR_SYSTEM.SURFACE}
          endpoint={endpoint}
          document={document}
          request={sibling.request}
          defaultValues={sibling.defaultValues}
          onSubmit={handleRequestSubmit}
          className="h-full"
        />
      </Drawer>
    </>
  );
};

export default Sibling;
