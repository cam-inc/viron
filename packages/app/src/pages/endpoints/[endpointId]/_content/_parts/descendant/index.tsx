import React, { useCallback, useState } from 'react';
import RequestComponent from '~/components/request';
import { BaseError } from '~/errors';
import Drawer, { useDrawer } from '~/portals/drawer';
import { COLOR_SYSTEM, Endpoint } from '~/types';
import { Document, RequestValue } from '~/types/oas';
import Action from '../action';
import { UseDescendantsReturn } from '../../_hooks/useDescendants';

export type Props = {
  endpoint: Endpoint;
  document: Document;
  descendant: UseDescendantsReturn[number];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOperationSuccess: (data: any) => void;
  onOperationFail: (error: BaseError) => void;
  onClick?: () => void;
};
const Descendant: React.FC<Props> = ({
  endpoint,
  document,
  descendant,
  data,
  onOperationSuccess,
  onOperationFail,
  onClick,
}) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const drawer = useDrawer();
  const handleClick = useCallback(
    function () {
      if (isPending) {
        return;
      }
      drawer.open();
      onClick?.();
    },
    [drawer, isPending, onClick]
  );

  const handleRequestSubmit = async function (requestValue: RequestValue) {
    drawer.close();
    setIsPending(true);
    const { data, error } = await descendant.fetch(requestValue);
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
      <Action request={descendant.request} onClick={handleClick} />
      <Drawer {...drawer.bind}>
        <RequestComponent
          on={COLOR_SYSTEM.SURFACE}
          endpoint={endpoint}
          document={document}
          request={descendant.request}
          defaultValues={descendant.getDefaultValues(data)}
          onSubmit={handleRequestSubmit}
          className="h-full"
        />
      </Drawer>
    </>
  );
};
export default Descendant;
