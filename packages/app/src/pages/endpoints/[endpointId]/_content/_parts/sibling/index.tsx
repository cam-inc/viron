import { IconType } from '@react-icons/all-files';
import { BiAddToQueue } from '@react-icons/all-files/bi/BiAddToQueue';
import { BiBandAid } from '@react-icons/all-files/bi/BiBandAid';
import { BiDownvote } from '@react-icons/all-files/bi/BiDownvote';
import { BiEdit } from '@react-icons/all-files/bi/BiEdit';
import { BiHeadphone } from '@react-icons/all-files/bi/BiHeadphone';
import { BiSticker } from '@react-icons/all-files/bi/BiSticker';
import { BiTestTube } from '@react-icons/all-files/bi/BiTestTube';
import { BiTrash } from '@react-icons/all-files/bi/BiTrash';
import React, { useCallback, useMemo, useState } from 'react';
import Button from '$components/button';
import Drawer, { useDrawer } from '$components/drawer';
import RequestComponent from '$components/request';
import { ON } from '$constants/index';
import { BaseError } from '$errors/index';
import { METHOD, RequestValue } from '$types/oas';
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

  const Icon = useMemo<IconType>(
    function () {
      switch (sibling.request.method) {
        case METHOD.GET:
          return BiDownvote;
        case METHOD.PUT:
          return BiEdit;
        case METHOD.POST:
          return BiAddToQueue;
        case METHOD.DELETE:
          return BiTrash;
        case METHOD.OPTIONS:
          return BiSticker;
        case METHOD.HEAD:
          return BiHeadphone;
        case METHOD.PATCH:
          return BiBandAid;
        case METHOD.TRACE:
          return BiTestTube;
      }
    },
    [sibling]
  );

  return (
    <>
      <Button
        on={ON.SURFACE}
        variant="text"
        Icon={Icon}
        onClick={handleClick}
      />
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
