import React, { useCallback, useState } from 'react';
import Drawer, { useDrawer } from '$components/drawer';
import RequestComponent from '$components/request';
import { BaseError } from '$errors/index';
import { RequestValue } from '$types/oas';
import Action from '../action';
import { UseSiblingsReturn } from '../../_hooks/useSiblings';

export type Props = {
  sibling: UseSiblingsReturn[number];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOperationSuccess: (data: any) => void;
  onOperationFail: (error: BaseError) => void;
};
const Sibling: React.FC<Props> = ({
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
      <Action method={sibling.request.method} onClick={handleClick} />
      <Drawer {...drawer.bind}>
        <RequestComponent
          request={sibling.request}
          defaultValues={sibling.defaultValues}
          onSubmit={handleRequestSubmit}
        />
      </Drawer>
    </>
  );
};

export default Sibling;
